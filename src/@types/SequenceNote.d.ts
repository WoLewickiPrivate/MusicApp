interface SequenceNote {
  /** NoteSequence id */
  id?: string | null;

  /** NoteSequence filename */
  filename?: string | null;

  /** NoteSequence referenceNumber */
  referenceNumber?: number | null;

  /** NoteSequence collectionName */
  collectionName?: string | null;

  /** NoteSequence ticksPerQuarter */
  ticksPerQuarter?: number | null;

  /** NoteSequence timeSignatures */
  timeSignatures?: ITimeSignature[] | null;

  /** NoteSequence keySignatures */
  keySignatures?: IKeySignature[] | null;

  /** NoteSequence tempos */
  tempos?: ITempo[] | null;

  /** NoteSequence notes */
  notes?: INote[] | null;

  /** NoteSequence totalTime */
  total_time?: number | null;

  /** NoteSequence totalQuantizedSteps */
  totalQuantizedSteps?: number | null;

  /** NoteSequence pitchBends */
  pitchBends?: IPitchBend[] | null;

  /** NoteSequence controlChanges */
  controlChanges?: IControlChange[] | null;

  /** NoteSequence partInfos */
  partInfos?: IPartInfo[] | null;

  /** NoteSequence sourceInfo */
  sourceInfo?: ISourceInfo | null;

  /** NoteSequence textAnnotations */
  textAnnotations?: ITextAnnotation[] | null;

  /** NoteSequence sectionAnnotations */
  sectionAnnotations?: ISectionAnnotation[] | null;

  /** NoteSequence sectionGroups */
  sectionGroups?: ISectionGroup[] | null;

  /** NoteSequence quantizationInfo */
  quantizationInfo?: IQuantizationInfo | null;

  /** NoteSequence subsequenceInfo */
  subsequenceInfo?: ISubsequenceInfo | null;

  /** NoteSequence sequenceMetadata */
  sequenceMetadata?: ISequenceMetadata | null;

  /** Tempo qpm */
  qpm?: number | null;
}

interface IQuantizationInfo {
  /** QuantizationInfo stepsPerQuarter */
  stepsPerQuarter?: number | null;

  /** QuantizationInfo stepsPerSecond */
  stepsPerSecond?: number | null;
}

interface ISection {
  /** Section sectionId */
  sectionId?: number | null;

  /** Section sectionGroup */
  sectionGroup?: ISectionGroup | null;
}

interface ISectionGroup {
  /** SectionGroup sections */
  sections?: ISection[] | null;

  /** SectionGroup numTimes */
  numTimes?: number | null;
}

interface ISectionAnnotation {
  /** SectionAnnotation time */
  time?: number | null;

  /** SectionAnnotation sectionId */
  sectionId?: number | null;
}

interface ITextAnnotation {
  /** TextAnnotation time */
  time?: number | null;

  /** TextAnnotation quantizedStep */
  quantizedStep?: number | null;

  /** TextAnnotation text */
  text?: string | null;

  /** TextAnnotation annotationType */
  annotationType?: TextAnnotationType | null;
}

interface ISourceInfo {
  /** SourceInfo sourceType */
  sourceType?: SourceInfo.SourceType | null;

  /** SourceInfo encodingType */
  encodingType?: SourceInfo.EncodingType | null;

  /** SourceInfo parser */
  parser?: SourceInfo.Parser | null;
}

interface IPartInfo {
  /** PartInfo part */
  part?: number | null;

  /** PartInfo name */
  name?: string | null;
}

interface IControlChange {
  /** ControlChange time */
  time?: number | null;

  /** ControlChange quantizedStep */
  quantizedStep?: number | null;

  /** ControlChange controlNumber */
  controlNumber?: number | null;

  /** ControlChange controlValue */
  controlValue?: number | null;

  /** ControlChange instrument */
  instrument?: number | null;

  /** ControlChange program */
  program?: number | null;

  /** ControlChange isDrum */
  isDrum?: boolean | null;
}

interface IPitchBend {
  /** PitchBend time */
  time?: number | null;

  /** PitchBend bend */
  bend?: number | null;

  /** PitchBend instrument */
  instrument?: number | null;

  /** PitchBend program */
  program?: number | null;

  /** PitchBend isDrum */
  isDrum?: boolean | null;
}

interface ISubsequenceInfo {
  /** SubsequenceInfo startTimeOffset */
  startTimeOffset?: number | null;

  /** SubsequenceInfo endTimeOffset */
  endTimeOffset?: number | null;
}

interface ISequenceMetadata {
  /** SequenceMetadata title */
  title?: string | null;

  /** SequenceMetadata artist */
  artist?: string | null;

  /** SequenceMetadata genre */
  genre?: string[] | null;

  /** SequenceMetadata composers */
  composers?: string[] | null;
}

interface ITimeSignature {
  /** TimeSignature time */
  time?: number | null;

  /** TimeSignature numerator */
  numerator?: number | null;

  /** TimeSignature denominator */
  denominator?: number | null;
}

interface IKeySignature {
  /** KeySignature time */
  time?: number | null;

  /** KeySignature key */
  key?: KeySignature.Key | null;

  /** KeySignature mode */
  mode?: KeySignature.Mode | null;
}

interface ITempo {
  /** Tempo time */
  time?: number | null;

  /** Tempo qpm */
  qpm?: number | null;
}

interface INote {
  /** Note pitch */
  pitch?: number | null;

  /** Note pitchName */
  pitchName?: PitchName | null;

  /** Note velocity */
  velocity?: number | null;

  /** Note startTime */
  start_time?: number | null;

  /** Note quantizedStartStep */
  quantizedStartStep?: number | null;

  /** Note endTime */
  end_time?: number | null;

  /** Note quantizedEndStep */
  quantizedEndStep?: number | null;

  /** Note numerator */
  numerator?: number | null;

  /** Note denominator */
  denominator?: number | null;

  /** Note instrument */
  instrument?: number | null;

  /** Note program */
  program?: number | null;

  /** Note isDrum */
  isDrum?: boolean | null;

  /** Note part */
  part?: number | null;

  /** Note voice */
  voice?: number | null;
}

declare namespace SourceInfo {
  /** SourceType enum. */
  enum SourceType {
    UNKNOWN_SOURCE_TYPE = 0,
    SCORE_BASED = 1,
    PERFORMANCE_BASED = 2,
  }

  /** EncodingType enum. */
  enum EncodingType {
    UNKNOWN_ENCODING_TYPE = 0,
    MUSIC_XML = 1,
    ABC = 2,
    MIDI = 3,
    MUSICNET = 4,
  }

  /** Parser enum. */
  enum Parser {
    UNKNOWN_PARSER = 0,
    MUSIC21 = 1,
    PRETTY_MIDI = 2,
    MAGENTA_MUSIC_XML = 3,
    MAGENTA_MUSICNET = 4,
    MAGENTA_ABC = 5,
    TONEJS_MIDI_CONVERT = 6,
  }
}

declare namespace KeySignature {
  /** Key enum. */
  enum Key {
    C = 0,
    C_SHARP = 1,
    D_FLAT = 1,
    D = 2,
    D_SHARP = 3,
    E_FLAT = 3,
    E = 4,
    F = 5,
    F_SHARP = 6,
    G_FLAT = 6,
    G = 7,
    G_SHARP = 8,
    A_FLAT = 8,
    A = 9,
    A_SHARP = 10,
    B_FLAT = 10,
    B = 11,
  }

  /** Mode enum. */
  enum Mode {
    MAJOR = 0,
    MINOR = 1,
    NOT_SPECIFIED = 2,
    MIXOLYDIAN = 3,
    DORIAN = 4,
    PHRYGIAN = 5,
    LYDIAN = 6,
    LOCRIAN = 7,
  }
}

declare enum PitchName {
  UNKNOWN_PITCH_NAME = 0,
  F_FLAT_FLAT = 1,
  C_FLAT_FLAT = 2,
  G_FLAT_FLAT = 3,
  D_FLAT_FLAT = 4,
  A_FLAT_FLAT = 5,
  E_FLAT_FLAT = 6,
  B_FLAT_FLAT = 7,
  F_FLAT = 8,
  C_FLAT = 9,
  G_FLAT = 10,
  D_FLAT = 11,
  A_FLAT = 12,
  E_FLAT = 13,
  B_FLAT = 14,
  F = 15,
  C = 16,
  G = 17,
  D = 18,
  A = 19,
  E = 20,
  B = 21,
  F_SHARP = 22,
  C_SHARP = 23,
  G_SHARP = 24,
  D_SHARP = 25,
  A_SHARP = 26,
  E_SHARP = 27,
  B_SHARP = 28,
  F_SHARP_SHARP = 29,
  C_SHARP_SHARP = 30,
  G_SHARP_SHARP = 31,
  D_SHARP_SHARP = 32,
  A_SHARP_SHARP = 33,
  E_SHARP_SHARP = 34,
  B_SHARP_SHARP = 35,
}

declare enum TextAnnotationType {
  UNKNOWN = 0,
  CHORD_SYMBOL = 1,
  BEAT = 2,
}
