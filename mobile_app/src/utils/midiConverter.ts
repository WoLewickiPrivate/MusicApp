export interface Sequence {
  totalDuration: number;
  midisArray: MidiElement[];
}

export default function convertSequenceNote(sequence: SequenceNote) {
  const totalDuration = sequence.totalTime ? sequence.totalTime : 0;
  const notesArray = sequence.notes ? sequence.notes : [];
  const defaultPitch = 60;

  const midisArray: Array<MidiElement> = [];

  if (notesArray) {
    notesArray.forEach(element => {
      midisArray.push({
        start: element.startTime ? element.startTime : 0,
        end: element.endTime ? element.endTime : totalDuration,
        pitch: element.pitch ? element.pitch : defaultPitch,
      });
    });
  }

  return {
    totalDuration,
    midisArray,
  };
}
