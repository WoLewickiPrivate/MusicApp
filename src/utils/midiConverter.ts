import { element } from 'prop-types';

export default function convertSequenceNote(sequence: SequenceNote) {
  const totalDuration = sequence.totalTime;
  const notesArray = sequence.notes;

  const midisArray: Array<MidiElement> = [];

  if (notesArray) {
    notesArray.forEach(element => {
      // if (element.startTime && element.endTime && element.pitch) {
      midisArray.push({
        start: element.startTime ? element.startTime : 0,
        end: element.endTime ? element.endTime : 0,
        pitch: element.pitch ? element.pitch : 0,
      });
      // } else if (!element.startTime && element.endTime && element.pitch) {
      // midisArray.push({
      //   start: 0,
      //   end: element.endTime ? element.endTime : 0,
      //   pitch: element.pitch ? element.pitch : 0,
      // });
      // }
    });
  }

  return {
    totalDuration,
    midisArray,
  };
}
