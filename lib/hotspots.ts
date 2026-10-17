export type HotspotId = "loop" | "xpipe" | "jpipe" | "tips";

export const HOTSPOTS: { id: HotspotId; label: string; title: string; text: string }[] = [
  { id: "loop", label: "Equalization loop", title: "+330 mm equalization loop",
    text: "Bank 1 runs 598 mm of downpipe plus 1698 mm of midpipe. Bank 2 runs 598 mm plus 1368 mm. The extra 330 mm loop on Bank 1 lines both banks up so their pulses arrive together." },
  { id: "xpipe", label: "X-pipe", title: "18° high-velocity X-pipe",
    text: "Both banks merge here. The shallow 18° crossover keeps gas speed high and interleaves the pulses at 120° intervals." },
  { id: "jpipe", label: "J-pipes", title: "Dual 650 mm J-pipes",
    text: "Two Helmholtz branches tuned to 204 Hz. At that frequency they cancel the cabin drone by quarter-wave interference." },
  { id: "tips", label: "Quad tips", title: "Quad 101.6 mm tips",
    text: "Slash-cut titanium and carbon fiber tips, laser-engraved with the Divina script and flower. The valved rear muffler cuts 15 to 20 dB when closed." },
];
