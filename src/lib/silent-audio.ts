/** A short silent WAV as a data URI, so the demo's native <audio> control is real and playable. */
export function silentWavDataUri(seconds = 8): string {
  const rate = 8000;
  const samples = rate * seconds;
  const buf = new Uint8Array(44 + samples);
  const dv = new DataView(buf.buffer);
  const tag = (o: number, s: string) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
  tag(0, "RIFF");
  dv.setUint32(4, 36 + samples, true);
  tag(8, "WAVEfmt ");
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true);
  dv.setUint32(24, rate, true);
  dv.setUint32(28, rate, true);
  dv.setUint16(32, 1, true);
  dv.setUint16(34, 8, true);
  tag(36, "data");
  dv.setUint32(40, samples, true);
  buf.fill(128, 44);
  let bin = "";
  buf.forEach((b) => (bin += String.fromCharCode(b)));
  return `data:audio/wav;base64,${btoa(bin)}`;
}
