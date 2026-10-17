const ROWS: [string, string][] = [
  ["Fitment", "BMW M3 G80 / M4 G82, 3.0L twin-turbo S58 inline-6"],
  ["Material", "Grade 2 titanium"],
  ["Wall thickness", "1.0 mm"],
  ["Total weight", "About 13.6 kg"],
  ["Welds", "15° pie-cut TIG"],
  ["Flanges", "V-band, ±0.2 mm tolerance"],
  ["Tailpipes", "Quad 101.6 mm (4.0\") slash-cut titanium or carbon fiber tips"],
  ["Tip engraving", "Divina script and 6-petal flower, laser-engraved"],
  ["Bank 1 path", "598 mm downpipe + 1698 mm midpipe (includes +330 mm loop)"],
  ["Bank 2 path", "598 mm downpipe + 1368 mm direct midpipe"],
  ["Crossover", "18° high-velocity X-pipe, 120° pulse interleaving"],
  ["Anti-drone", "Dual 650 mm Helmholtz J-pipes at 204 Hz"],
  ["Rear muffler", "Dual-path valved, 15 to 20 dB attenuation when closed"],
];

export default function SpecSheet() {
  return (
    <section id="specs" className="mx-auto max-w-6xl px-5 py-20 md:px-8">
      <h2 className="text-3xl font-bold md:text-4xl">Specifications</h2>
      <div className="mt-8 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">Divina S58 Quad-Tip technical specifications</caption>
          <tbody>
            {ROWS.map(([k, v], i) => (
              <tr key={k} className={i % 2 ? "bg-[#0a0907]" : ""}>
                <th scope="row" className="w-1/3 px-5 py-3.5 font-semibold text-gold">{k}</th>
                <td className="px-5 py-3.5 text-sand/85">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
