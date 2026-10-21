export type PlacedWord = {
  token: string;
  peso: number;
  x: number;
  y: number;
  size: number;
  width: number;
  height: number;
};

export function layoutWords(
  words: { token: string; peso: number }[],
  width: number,
  height: number,
): PlacedWord[] {
  if (words.length === 0 || width < 40 || height < 40) return [];
  const max = words[0]?.peso ?? 1;
  const min = words[words.length - 1]?.peso ?? max;
  const placed: PlacedWord[] = [];
  const cx = width / 2;
  const cy = height / 2;

  for (const word of words) {
    const t = max === min ? 1 : (word.peso - min) / (max - min);
    const size = 13 + t * 23;
    const boxW = size * word.token.length * 0.56;
    const boxH = size * 1.15;
    let spot: { x: number; y: number } | null = null;
    for (let step = 0; step < 700; step += 1) {
      const angle = step * 0.42;
      const radius = step * 0.72;
      const x = cx + Math.cos(angle) * radius - boxW / 2;
      const y = cy + Math.sin(angle) * radius - boxH / 2;
      if (x < 2 || y < 2 || x + boxW > width - 2 || y + boxH > height - 2) continue;
      const hits = placed.some((item) => overlaps(item, x, y, boxW, boxH));
      if (!hits) {
        spot = { x, y };
        break;
      }
    }
    if (!spot) continue;
    placed.push({ token: word.token, peso: word.peso, x: spot.x, y: spot.y, size, width: boxW, height: boxH });
  }
  return placed;
}

function overlaps(item: PlacedWord, x: number, y: number, w: number, h: number) {
  const pad = 4;
  return !(item.x + item.width + pad < x || x + w + pad < item.x || item.y + item.height + pad < y || y + h + pad < item.y);
}
