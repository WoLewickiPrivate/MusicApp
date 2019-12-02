import {
  fetchNotes,
  CreateSongParams,
  createSong,
} from '../networking/ServerConnector';

export interface Sequence {
  totalDuration: number;
  midisArray: MidiElement[];
}

interface NotesSpec {
  levelNumber: number;
  noteSequence: SequenceNote;
}

export function getLevelNotes(noteSequence: SequenceNote): Sequence {
  const totalDuration = noteSequence.total_time ? noteSequence.total_time : 0;
  const notesArray = noteSequence.notes ? noteSequence.notes : [];
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
