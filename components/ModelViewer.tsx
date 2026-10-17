"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HOTSPOTS, HotspotId } from "@/lib/hotspots";

const ModelScene = dynamic(() => import("./ModelScene"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sand/50">Loading 3D model</div>,
});

export default function ModelViewer() {
  const [active, setActive] = useState<HotspotId | null>("loop");
  const info = HOTSPOTS.find((h) => h.id === active);

  return (
    <section id="showroom" className="mx-auto max-w-6xl px-5 py-20 md:px-8">
      <h2 className="text-3xl font-bold md:text-4xl">3D showroom</h2>
      <p className="mt-3 max-w-2xl text-sand/70">Drag to rotate, scroll to zoom. Select a gold marker to see what that section does.</p>

      <div className="mt-8 h-[420px] overflow-hidden rounded-lg border border-line bg-black md:h-[560px]">
        <ModelScene active={active} onSelect={setActive} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Exhaust sections">
        {HOTSPOTS.map((h) => (
          <button key={h.id} onClick={() => setActive(active === h.id ? null : h.id)} aria-pressed={active === h.id}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active === h.id ? "border-gold bg-gold text-black" : "border-line text-sand/80 hover:border-gold/60"}`}>
            {h.label}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[96px] rounded-lg border border-line bg-[#0a0907] p-5" aria-live="polite">
        {info ? (
          <>
            <h3 className="font-semibold text-gold">{info.title}</h3>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-sand/80">{info.text}</p>
          </>
        ) : (
          <p className="text-sm text-sand/60">Select a section to read about it.</p>
        )}
      </div>
    </section>
  );
}
