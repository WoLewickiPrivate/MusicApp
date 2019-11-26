import { NotesSpec } from './LevelNotesReducer';

export enum LevelNotesActions {
  ADD_LEVEL_NOTES = 'CHECK_LEVEL_NOTES',
}

export const addLevelNotes = (notesSpec: NotesSpec) => {
  return { type: LevelNotesActions.ADD_LEVEL_NOTES, notesSpec };
};
