import range from 'just-range';

const SORTED_PITCHES: string[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];
const ACCIDENTAL_PITCHES: string[] = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
const PITCH_INDEXES: { [id: string]: number } = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};
const MIDI_NUMBER_C0 = 12;
const MIN_MIDI_NUMBER = MIDI_NUMBER_C0;
const MAX_MIDI_NUMBER = 127;
const NOTE_REGEX = /([a-g])([#b]?)(\d+)/;
const NOTES_IN_OCTAVE = 12;

// Converts string notes in scientific pitch notation to a MIDI number, or null.
//
// Example: "c#0" => 13, "eb5" => 75, "abc" => null
//
// References:
// - http://www.flutopedia.com/octave_notation.htm
// - https://github.com/danigb/tonal/blob/master/packages/note/index.js
function fromNote(note: String) {
  if (!note) {
    throw Error('Invalid note argument');
  }
  const match = NOTE_REGEX.exec(note.toLowerCase());
  if (!match) {
    throw Error('Invalid note argument');
  }
  const [, letter, accidental, octave] = match;
  const pitchName = `${letter.toUpperCase()}${accidental}`;
  const pitchIndex = PITCH_INDEXES[pitchName];
  if (pitchIndex == null) {
    throw Error('Invalid note argument');
  }
  return MIDI_NUMBER_C0 + pitchIndex + NOTES_IN_OCTAVE * parseInt(octave, 10);
}

//
// Build cache for getAttributes
//
function buildMidiNumberAttributes(midiNumber: number) {
  const pitchIndex = (midiNumber - MIDI_NUMBER_C0) % NOTES_IN_OCTAVE;
  const octave = Math.floor((midiNumber - MIDI_NUMBER_C0) / NOTES_IN_OCTAVE);
  const pitchName = SORTED_PITCHES[pitchIndex];
  return {
    note: `${pitchName}${octave}`,
    pitchName,
    octave,
    midiNumber,
    isAccidental: ACCIDENTAL_PITCHES.includes(pitchName),
  };
}

function buildMidiNumberAttributesCache() {
  return range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).reduce(
    (cache: any, midiNumber: number) => {
      cache[midiNumber] = buildMidiNumberAttributes(midiNumber);
      return cache;
    },
    {},
  );
}

const midiNumberAttributesCache = buildMidiNumberAttributesCache();

// Returns an object containing various attributes for a given MIDI number.
// Throws error for invalid midiNumbers.
function getAttributes(midiNumber: number) {
  const attrs = midiNumberAttributesCache[midiNumber];
  if (!attrs) {
    throw Error('Invalid MIDI number');
  }
  return attrs;
}

// Returns all MIDI numbers corresponding to natural notes, e.g. C and not C# or Bb.
const NATURAL_MIDI_NUMBERS = range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).filter(
  (midiNumber: number) => !getAttributes(midiNumber).isAccidental,
);

const SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');
const FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');
/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * import { midiToNoteName } from '@tonal/midi'
 * midiToNoteName(61) // => "Db4"
 * midiToNoteName(61, { pitchClass: true }) // => "Db"
 * midiToNoteName(61, { sharps: true }) // => "C#4"
 * midiToNoteName(61, { pitchClass: true, sharps: true }) // => "C#"
 * // it rounds to nearest note
 * midiToNoteName(61.7) // => "D4"
 */
function midiToNoteName(
  midi: number,
  options: { pitchClass?: boolean; sharps: boolean } = { sharps: true },
) {
  midi = Math.round(midi);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];
  if (options.pitchClass) return pc;
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}

export default {
  fromNote,
  getAttributes,
  MIN_MIDI_NUMBER,
  MAX_MIDI_NUMBER,
  NATURAL_MIDI_NUMBERS,
  midiToNoteName,
};
