import { LevelNotesActions } from './LevelNotesActions';

export interface LevelNotesReducerState {
  levelNotes: Array<SequenceNote | null>;
}

export interface NotesSpec {
  levelNumber: number;
  noteSequence: SequenceNote;
}

const INITIAL_LEVEL_NOTES_STATE: LevelNotesReducerState = {
  // first one is never used cause there is no level 0
  levelNotes: Array<SequenceNote | null>(21).fill(null),
};

interface LevelNotesAction {
  type: LevelNotesActions;
  notesSpec: NotesSpec;
}

export const levelNotesReducer = (
  state: LevelNotesReducerState = INITIAL_LEVEL_NOTES_STATE,
  action: LevelNotesAction,
) => {
  switch (action.type) {
    case LevelNotesActions.ADD_LEVEL_NOTES: {
      let newArray = state.levelNotes.slice();
      newArray[action.notesSpec.levelNumber] = action.notesSpec.noteSequence;
      return {
        ...state,
        levelNotes: newArray,
      };
    }
    default: {
      return state;
    }
  }
};
