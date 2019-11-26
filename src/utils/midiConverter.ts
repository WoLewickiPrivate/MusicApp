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

export async function getLevelNotes(
  levelNumber: number,
  token: string,
  levelNotes?: Array<SequenceNote | null>,
  addNotesToLevel?: (notesSpec: NotesSpec) => void,
): Promise<Sequence> {
  try {
    let noteSequence;
    if (levelNotes && levelNumber > 0) {
      noteSequence = levelNotes[levelNumber];
      if (!noteSequence) {
        noteSequence = await fetchNotes(levelNumber, token);
        // console.warn(noteSequence);
        // addNotesToLevel({ levelNumber, noteSequence });
      }
    } else {
      const params: CreateSongParams = {
        id: '42',
        startTime: '4.2',
        stopTime: '33',
        token,
      };
      noteSequence = await createSong(params);
    }
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
  } catch (error) {
    throw new Error(error);
  }
}
