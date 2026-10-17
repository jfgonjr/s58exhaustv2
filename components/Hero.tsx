"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";
import AudioEngine from "./AudioEngine";

export default function Hero() {
  return (
    <header className="mx-auto max-w-6xl px-5 pb-20 pt-6 md:px-8">
      <div className="flex items-center justify-between">
        <Logo size={40} />
        <nav className="hidden gap-7 text-sm text-sand/70 md:flex" aria-label="Sections">
          <a href="#physics" className="hover:text-sand">Engineering</a>
          <a href="#showroom" className="hover:text-sand">3D showroom</a>
          <a href="#specs" className="hover:text-sand">Specifications</a>
          <a href="#preorder" className="hover:text-sand">Pre-order</a>
        </nav>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mt-16 max-w-4xl md:mt-24">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          DIVINA S58 QUAD-TIP EQUAL LENGTH EXHAUST SYSTEM
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand/75">
          4x 101.6mm Quad-Tip Architecture. Pure 120° Pulse Interleaving. Converting the BMW S58 into a High-Pitched V12 Masterpiece.
        </p>
      </motion.div>

      <div className="mt-12"><AudioEngine /></div>
    </header>
  );
}
