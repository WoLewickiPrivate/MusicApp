import { RefObject } from 'react';
import { Animated } from 'react-native';

import { Sequence } from '../utils/midiConverter';
import range from '../utils/rangeUtils';
import Piano from '../components/Piano/Piano';

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

export { calculateSongLength, arraysEqual, countGainedStars };
