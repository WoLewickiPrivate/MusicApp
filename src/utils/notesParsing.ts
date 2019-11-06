import { RefObject } from 'react';
import { Animated } from 'react-native';

import { Sequence } from '../utils/midiConverter';
import range from '../utils/rangeUtils';
import Piano from '../components/Piano/Piano';

function initializeMidiMap(notes: Sequence, brickUnitLength: number) {
  const midis = notes.midisArray.map(element => {
    return {
      start: Math.trunc(element.start * brickUnitLength),
      end: Math.trunc(element.end * brickUnitLength),
      pitch: element.pitch,
    };
  });
  console.warn(notes);
  const startTime = midis[0].start;
  const endTime = midis[midis.length - 1].end;

  const midisMap: Array<Array<number>> = range(0, endTime + 1).map(() => []);

  console.warn(midis.length);

  midis.forEach(element => {
    for (let i = element.start; i < element.end; i++) {
      midisMap[i].push(element.pitch);
    }
  });

  return midisMap;
}

function calculateSongLength(
  totalDuration: number,
  brickUnitLength: number,
): number {
  return totalDuration * brickUnitLength;
}

function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function countGainedStars(): number {
  const starsGained = Math.floor(Math.random() * 58) % 4;
  return starsGained;
}

export {
  initializeMidiMap,
  calculateSongLength,
  arraysEqual,
  countGainedStars,
};
