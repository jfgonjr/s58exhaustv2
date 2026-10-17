"use client";

import { useEffect, useRef } from "react";

const MAX_HZ = 3000;
const W = 960;
const H = 240;
const COL = 2;

function color(v: number): string {
  // black -> dark sand -> gold -> light sand
  const t = v / 255;
  const stops = [
    [0, 0, 0],
    [74, 58, 34],
    [201, 168, 106],
    [243, 234, 215],
  ];
  const p = t * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(p));
  const f = p - i;
  const c = stops[i].map((s, k) => Math.round(s + (stops[i + 1][k] - s) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export default function Spectrogram({ analyser }: { analyser: AnalyserNode | null }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;
    g.fillStyle = "#000";
    g.fillRect(0, 0, W, H);
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const binHz = analyser.context.sampleRate / analyser.fftSize;
    const maxBin = Math.floor(MAX_HZ / binHz);
    let raf = 0;

    const draw = () => {
      analyser.getByteFrequencyData(data);
      g.drawImage(canvas, -COL, 0);
      for (let y = 0; y < H; y++) {
        const bin = Math.floor(maxBin * (1 - y / H));
        g.fillStyle = color(data[bin]);
        g.fillRect(W - COL, y, COL, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [analyser]);

  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-black">
      <canvas ref={ref} width={W} height={H} className="block h-48 w-full md:h-60" aria-label="Live frequency spectrogram, 0 to 3 kHz" />
      {[1000, 2000].map((hz) => (
        <span key={hz} className="pointer-events-none absolute right-2 text-[11px] text-sand/50" style={{ top: `${(1 - hz / MAX_HZ) * 100}%` }}>
          {hz / 1000} kHz
        </span>
      ))}
      <span className="pointer-events-none absolute right-2 top-1 text-[11px] text-sand/50">3 kHz</span>
      <span className="pointer-events-none absolute bottom-1 right-2 text-[11px] text-sand/50">0 Hz</span>
      <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-gold/60" style={{ top: `${(1 - 204 / MAX_HZ) * 100}%` }}>
        <span className="absolute left-2 -top-4 text-[11px] text-gold">204 Hz J-pipe cancellation</span>
      </div>
    </div>
  );
}
