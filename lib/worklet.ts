// Cylinder pulse synthesizer running on the audio thread (AudioWorklet).
// Inline-6 four-stroke, firing order 1-5-3-6-2-4: 6 pulses every 720° => rpm/20 pulses per second.
// mode 0 = stock OEM (uneven pulse energy, raspy noise, longer decay)
// mode 1 = Divina equal length (even pulses, clean, short bright decay)
export const WORKLET_SRC = `
class ExhaustPulse extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "rpm", defaultValue: 1000, minValue: 0, maxValue: 9000, automationRate: "k-rate" },
      { name: "mode", defaultValue: 1, minValue: 0, maxValue: 1, automationRate: "k-rate" }
    ];
  }
  constructor() {
    super();
    this.ph = 0; this.idx = 0; this.env = 0; this.m = 1; this.lp = 0;
  }
  process(inputs, outputs, params) {
    const out = outputs[0][0];
    const rpm = Math.max(params.rpm[0], 300);
    const target = params.mode[0];
    const pps = rpm / 20;
    const STOCK = [1.0, 0.55, 0.85, 0.5, 0.95, 0.65];
    for (let i = 0; i < out.length; i++) {
      this.m += (target - this.m) * 0.0004;
      this.ph += pps / sampleRate;
      if (this.ph >= 1) {
        this.ph -= 1;
        this.idx = (this.idx + 1) % 6;
        const stock = STOCK[this.idx] * (0.85 + Math.random() * 0.3);
        const even = 1 - Math.random() * 0.03;
        this.env = stock + (even - stock) * this.m;
      }
      const tau = (20 / rpm) * (0.5 - 0.28 * this.m);
      this.env *= Math.exp(-1 / (sampleRate * tau));
      const noise = (Math.random() * 2 - 1) * (0.55 - 0.5 * this.m);
      const v = this.env * (1 + noise);
      const a = 0.25 + 0.75 * this.m;
      this.lp += a * (v - this.lp);
      out[i] = this.lp * 0.3;
    }
    return true;
  }
}
registerProcessor("exhaust-pulse", ExhaustPulse);
`;
