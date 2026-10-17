"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Power, Volume2 } from "lucide-react";
import Spectrogram from "./Spectrogram";
import { WORKLET_SRC } from "@/lib/worklet";

const IDLE = 1000;
const REDLINE = 7200;

type Engine = {
  ctx: AudioContext;
  rpm: AudioParam;
  mode: AudioParam;
  notch: BiquadFilterNode;
  f1: BiquadFilterNode;
  f2: BiquadFilterNode;
  valveLp: BiquadFilterNode;
  valveGain: GainNode;
  level: GainNode;
};

export default function AudioEngine() {
  const eng = useRef<Engine | null>(null);
  const [ready, setReady] = useState(false);
  const [starting, setStarting] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [divina, setDivina] = useState(true);
  const [valveOpen, setValveOpen] = useState(true);
  const [base, setBase] = useState(IDLE);
  const [rpmView, setRpmView] = useState(IDLE);

  const revving = useRef(false);
  const baseRef = useRef(IDLE);
  const cur = useRef(IDLE);
  baseRef.current = base;

  const start = useCallback(async () => {
    if (eng.current || starting) return;
    setStarting(true);
    try {
      const ctx = new AudioContext({ latencyHint: "interactive" });
      const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: "application/javascript" }));
      await ctx.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      const node = new AudioWorkletNode(ctx, "exhaust-pulse", { numberOfInputs: 0, outputChannelCount: [1] });
      const bq = (type: BiquadFilterType, f: number, q: number, g = 0) => {
        const b = ctx.createBiquadFilter();
        b.type = type; b.frequency.value = f; b.Q.value = q; b.gain.value = g;
        return b;
      };
      const hp = bq("highpass", 35, 0.7);
      const notch = bq("peaking", 204, 5, -18);   // J-pipe anti-drone
      const f1 = bq("peaking", 650, 0.9, 9);      // V12 harmonic sweet spot (400-900 Hz)
      const f2 = bq("peaking", 2800, 7, 7);       // thin-wall titanium ring
      const valveLp = bq("lowpass", 18000, 0.7);
      const valveGain = ctx.createGain();
      const level = ctx.createGain();
      level.gain.value = 0.35;
      const comp = ctx.createDynamicsCompressor();
      const master = ctx.createGain();
      master.gain.value = 0.8;
      const an = ctx.createAnalyser();
      an.fftSize = 4096;
      an.smoothingTimeConstant = 0.6;

      node.connect(hp).connect(notch).connect(f1).connect(f2).connect(valveLp).connect(valveGain).connect(level).connect(comp);
      comp.connect(master).connect(ctx.destination);
      comp.connect(an);

      eng.current = {
        ctx, notch, f1, f2, valveLp, valveGain, level,
        rpm: node.parameters.get("rpm")!,
        mode: node.parameters.get("mode")!,
      };
      setAnalyser(an);
      setReady(true);
    } finally {
      setStarting(false);
    }
  }, [starting]);

  // A/B: stock vs Divina
  useEffect(() => {
    const e = eng.current;
    if (!e) return;
    const t = e.ctx.currentTime;
    e.mode.setTargetAtTime(divina ? 1 : 0, t, 0.05);
    e.notch.gain.setTargetAtTime(divina ? -18 : 0, t, 0.05);
    e.f1.gain.setTargetAtTime(divina ? 9 : 3, t, 0.05);
    e.f2.gain.setTargetAtTime(divina ? 7 : 2, t, 0.05);
  }, [divina, ready]);

  // Valve routing: low-pass + -18 dB when closed
  useEffect(() => {
    const e = eng.current;
    if (!e) return;
    const t = e.ctx.currentTime;
    e.valveLp.frequency.setTargetAtTime(valveOpen ? 18000 : 650, t, 0.06);
    e.valveGain.gain.setTargetAtTime(valveOpen ? 1 : Math.pow(10, -18 / 20), t, 0.06);
  }, [valveOpen, ready]);

  // RPM dynamics
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const e = eng.current;
      if (!e) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = revving.current ? REDLINE : baseRef.current;
      const k = target > cur.current ? 1.8 : 2.6;
      cur.current += (target - cur.current) * (1 - Math.exp(-dt * k));
      const t = e.ctx.currentTime;
      e.rpm.setTargetAtTime(cur.current, t, 0.03);
      e.level.gain.setTargetAtTime(0.35 + 0.65 * ((cur.current - IDLE) / (REDLINE - IDLE)), t, 0.05);
      acc += dt;
      if (acc > 0.066) { acc = 0; setRpmView(Math.round(cur.current)); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  useEffect(() => () => { eng.current?.ctx.close(); eng.current = null; }, []);

  const rev = (on: boolean) => () => { revving.current = on; };
  const pct = ((rpmView - IDLE) / (REDLINE - IDLE)) * 100;

  const seg = (active: boolean) =>
    `px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-sand text-black" : "text-sand/70 hover:text-sand"}`;

  return (
    <section aria-label="Exhaust soundboard" className="rounded-lg border border-line bg-[#0a0907] p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Soundboard</h2>
          <p className="text-sm text-sand/60">Synthesized live from cylinder pulses (1-5-3-6-2-4). No recordings.</p>
        </div>
        {!ready ? (
          <button onClick={start} disabled={starting} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-black transition hover:bg-sand disabled:opacity-60">
            <Power size={16} /> {starting ? "Starting" : "Start engine"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-sand/60"><Volume2 size={16} /> Engine running</div>
        )}
      </div>

      <div className="mt-5"><Spectrogram analyser={analyser} /></div>

      <div className={`mt-5 grid gap-5 md:grid-cols-[1fr_auto] ${ready ? "" : "pointer-events-none opacity-40"}`}>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="rpm" className="text-sm text-sand/70">Throttle</label>
            <output className="tabular-nums text-3xl font-semibold text-gold">{rpmView.toLocaleString("en-US")} <span className="text-sm font-normal text-sand/60">rpm</span></output>
          </div>
          <input id="rpm" type="range" min={IDLE} max={REDLINE} step={50} value={base} onChange={(e) => setBase(Number(e.target.value))} className="mt-2 w-full accent-[#C9A86A]" />
          <div className="mt-2 h-1 w-full overflow-hidden rounded bg-line"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
          <button
            onPointerDown={rev(true)} onPointerUp={rev(false)} onPointerLeave={rev(false)} onPointerCancel={rev(false)}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") revving.current = true; }}
            onKeyUp={() => { revving.current = false; }}
            className="mt-4 w-full select-none rounded-md border border-gold px-4 py-3 text-sm font-bold text-gold transition hover:bg-gold hover:text-black active:bg-gold active:text-black"
          >
            Hold to rev to redline
          </button>
        </div>

        <div className="flex flex-col gap-4 md:min-w-[260px]">
          <div>
            <p className="mb-1.5 text-sm text-sand/70">Sound</p>
            <div className="inline-flex overflow-hidden rounded-full border border-gold/60" role="group" aria-label="A/B comparison">
              <button className={seg(!divina)} aria-pressed={!divina} onClick={() => setDivina(false)}>Stock S58</button>
              <button className={seg(divina)} aria-pressed={divina} onClick={() => setDivina(true)}>Divina equal length</button>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-sand/70">Rear muffler valve</p>
            <div className="inline-flex overflow-hidden rounded-full border border-gold/60" role="group" aria-label="Valve">
              <button className={seg(valveOpen)} aria-pressed={valveOpen} onClick={() => setValveOpen(true)}>Open</button>
              <button className={seg(!valveOpen)} aria-pressed={!valveOpen} onClick={() => setValveOpen(false)}>Closed</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
