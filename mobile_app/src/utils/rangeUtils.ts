export default function range(
  start: number,
  stop: number,
  step: number = 1,
): Array<number> {
  const result = [];
  if (step < 0) {
    for (let i = stop; i < start; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i < stop; i += step) {
      result.push(i);
    }
  }

  return result;
}
