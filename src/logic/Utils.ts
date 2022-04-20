
/** returns the stroke path for the Path svg element as Bézier curve */
export const computeBezierCurve = (x1: number, y1: number, x2: number, y2: number):string => {
  const dif = Math.abs(x1 - x2) / 1.5;
  const str: string = "M" + x1 + "," + y1 + "C" +
      (x1 + dif) + "," + y1 + ", " +
      (x2 - dif) + "," + y2 + " " +
      x2 + "," + y2;
  return str;
}