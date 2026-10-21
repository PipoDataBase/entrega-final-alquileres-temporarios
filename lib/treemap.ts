export type TreemapRect = { id: string; x: number; y: number; w: number; h: number };

type AreaItem = { id: string; area: number };

export function squarify(items: { id: string; value: number }[], width: number, height: number): TreemapRect[] {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  if (total <= 0 || width <= 0 || height <= 0) return [];
  const areas: AreaItem[] = items
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((item) => ({ id: item.id, area: (item.value / total) * width * height }));

  const rects: TreemapRect[] = [];
  let x = 0;
  let y = 0;
  let w = width;
  let h = height;
  let index = 0;

  while (index < areas.length && w > 1 && h > 1) {
    const side = Math.min(w, h);
    const row: AreaItem[] = [];
    let rowArea = 0;
    let best = Infinity;
    while (index < areas.length) {
      const candidate = areas[index];
      const next = [...row, candidate];
      const nextArea = rowArea + candidate.area;
      const score = worstRatio(next, nextArea, side);
      if (row.length === 0 || score <= best) {
        row.push(candidate);
        rowArea = nextArea;
        best = score;
        index += 1;
      } else {
        break;
      }
    }
    placeRow(row, rowArea, x, y, w, h, rects);
    if (w >= h) {
      const thickness = rowArea / h;
      x += thickness;
      w -= thickness;
    } else {
      const thickness = rowArea / w;
      y += thickness;
      h -= thickness;
    }
  }
  return rects;
}

function worstRatio(row: AreaItem[], rowArea: number, side: number) {
  const thickness = rowArea / side;
  let worst = 0;
  for (const item of row) {
    const length = item.area / thickness;
    const ratio = Math.max(thickness / length, length / thickness);
    if (ratio > worst) worst = ratio;
  }
  return worst;
}

function placeRow(row: AreaItem[], rowArea: number, x: number, y: number, w: number, h: number, rects: TreemapRect[]) {
  if (w >= h) {
    const thickness = rowArea / h;
    let cursor = y;
    for (const item of row) {
      const rh = item.area / thickness;
      rects.push({ id: item.id, x, y: cursor, w: thickness, h: rh });
      cursor += rh;
    }
  } else {
    const thickness = rowArea / w;
    let cursor = x;
    for (const item of row) {
      const rw = item.area / thickness;
      rects.push({ id: item.id, x: cursor, y, w: rw, h: thickness });
      cursor += rw;
    }
  }
}
