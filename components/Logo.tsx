"use client";

import { Pinyon_Script } from "next/font/google";

const script = Pinyon_Script({ weight: "400", subsets: ["latin"], display: "swap" });

const PETALA = "M32 33C23 29 20 17 27 9.5C29.5 7 34.5 7 37 9.5C44 17 41 29 32 33Z";

type FlorProps = {
  size?: number;
  petalas?: string; // cor das pétalas
  miolo?: string;   // cor do miolo
  fundo?: string;   // cor de fundo da página (separa as pétalas)
  animar?: boolean;
};

export function Flor({
  size = 36,
  petalas = "#F3EAD7",
  miolo = "#C9A86A",
  fundo = "#000000",
  animar = true,
}: FlorProps) {
  const externas = [0, 60, 120, 180, 240, 300];
  const internas = [30, 90, 150, 210, 270, 330];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="Divina"
      style={{ overflow: "visible", flex: "none" }}
    >
      <style>{`
        @keyframes divina-respira {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.07) rotate(8deg); }
        }
        .divina-in { transform-box: fill-box; transform-origin: center; }
        .divina-anim { animation: divina-respira 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .divina-anim { animation: none; } }
      `}</style>

      {externas.map((r) => (
        <path
          key={r}
          d={PETALA}
          transform={`rotate(${r} 32 32)`}
          fill={petalas}
          stroke={fundo}
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
      ))}

      <g className={`divina-in ${animar ? "divina-anim" : ""}`}>
        {internas.map((r) => (
          <path
            key={r}
            d={PETALA}
            transform={`rotate(${r} 32 32) translate(32 32) scale(.6) translate(-32 -32)`}
            fill={miolo}
            fillOpacity={0.34}
          />
        ))}
      </g>

      <circle cx={32} cy={32} r={5.2} fill={miolo} />
    </svg>
  );
}

type LogoProps = {
  size?: number;
  className?: string;
  showName?: boolean;
};

export default function Logo({ size = 40, className = "", showName = true }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      style={{ color: "#F3EAD7" }}
    >
      <Flor size={size} />
      {showName && (
        <span
          className={script.className}
          style={{
            fontSize: size * 1.15,
            lineHeight: 1,
            letterSpacing: "0.01em",
            // leve ajuste óptico para alinhar a linha de base com o centro da flor
            transform: "translateY(-2px)",
          }}
        >
          Divina
        </span>
      )}
    </div>
  );
}
