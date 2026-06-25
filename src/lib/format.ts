const FRACTIONS: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
};

export function formatAmount(n: number): string {
  const rounded = Math.round(n * 4) / 4;
  const whole = Math.floor(rounded);
  const frac = +(rounded - whole).toFixed(2);
  if (frac === 0) return String(whole);
  const glyph = FRACTIONS[String(frac)];
  if (!glyph) return String(rounded);
  if (whole === 0) return glyph;
  return `${whole}${glyph}`;
}

export function scaledAmount(amount: number, ratio: number): string {
  return formatAmount(amount * ratio);
}
