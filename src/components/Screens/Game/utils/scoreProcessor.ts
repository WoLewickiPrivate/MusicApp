export interface NoteMask {
  start: number;
  end: number;
  value: boolean;
}

export function findWorstInterval(noteMaskArray: Array<NoteMask>) {
  const sortedNoteMaskArray = noteMaskArray.sort((a, b) => {
    return a.start - b.start;
  });

  const logestWrongSequence = findLongestWrongSequence(sortedNoteMaskArray);
  return [
    logestWrongSequence[0].start,
    logestWrongSequence[logestWrongSequence.length - 1].end,
  ];
}

export function findLongestWrongSequence(noteMaskArray: Array<NoteMask>) {
  return noteMaskArray
    .reduce((prev: Array<Array<NoteMask>>, curr: NoteMask) => {
      if (prev.length > 0 && curr.value === prev[prev.length - 1][0].value) {
        return [...prev, [...prev[prev.length - 1], curr]];
      } else {
        return [...prev, [curr]];
      }
    }, [])
    .reduce((prev, curr) =>
      prev.length > curr.length && prev[0].value == false ? prev : curr,
    );
}
