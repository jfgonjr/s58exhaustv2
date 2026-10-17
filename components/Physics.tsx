"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const CARDS = [
  { value: "+330 mm", title: "Bank 1 equalization loop",
    short: "Matches the path length of both banks.",
    detail: "Bank 1: 598 mm downpipe + 1698 mm midpipe. Bank 2: 598 mm downpipe + 1368 mm direct midpipe. The 330 mm loop makes up the difference." },
  { value: "579 µs", title: "Delay alignment",
    short: "The time the loop adds to Bank 1 pulses.",
    detail: "330 mm of extra gas path takes about 579 µs to cross. That delay is built into Bank 1, so pulses from both banks reach the merge together." },
  { value: "18°", title: "High-velocity X-pipe",
    short: "Where both banks merge.",
    detail: "A shallow 18° crossover keeps gas speed up and interleaves pulses at 120° intervals, which is what gives the smooth, high V12-style note." },
  { value: "204 Hz", title: "J-pipe anti-drone",
    short: "Removes cabin drone.",
    detail: "Two 650 mm Helmholtz J-pipes act as quarter-wave resonators at 204 Hz. Their reflected wave cancels the drone frequency before it reaches the cabin." },
];

export default function Physics() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="physics" className="mx-auto max-w-6xl px-5 py-20 md:px-8">
      <h2 className="text-3xl font-bold md:text-4xl">Acoustic engineering</h2>
      <p className="mt-3 max-w-2xl text-sand/70">Four numbers explain the sound. Select a card for the detail.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {CARDS.map((c, i) => {
          const isOpen = open === i;
          return (
            <button key={c.title} onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
              className="rounded-lg border border-line bg-[#0a0907] p-6 text-left transition-colors hover:border-gold/60">
              <div className="flex items-start justify-between gap-4">
                <span className="text-4xl font-semibold text-gold">{c.value}</span>
                <Plus size={20} className={`mt-2 shrink-0 text-sand/60 transition-transform ${isOpen ? "rotate-45" : ""}`} />
              </div>
              <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-sand/65">{c.short}</p>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pt-3 text-sm leading-relaxed text-sand/85">
                    {c.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </section>
  );
}
