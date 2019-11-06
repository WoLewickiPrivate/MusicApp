export interface Sequence {
  totalDuration: number;
  midisArray: MidiElement[];
}

export default function convertSequenceNote(sequence: SequenceNote) {
  const totalDuration = sequence.total_time ? sequence.total_time : 0;
  const notesArray = sequence.notes ? sequence.notes : [];
  const defaultPitch = 60;

  const midisArray: Array<MidiElement> = [];

  if (notesArray) {
    notesArray.forEach(element => {
      midisArray.push({
        start: element.start_time ? element.start_time : 0,
        end: element.end_time ? element.end_time : totalDuration,
        pitch: element.pitch ? element.pitch : defaultPitch,
      });
    });
  }

  return {
    totalDuration,
    midisArray,
  };
}
