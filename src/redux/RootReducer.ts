import { levelStarsReducer, LevelStarsReducerState } from './LevelStarsReducer';
import { levelNotesReducer, LevelNotesReducerState } from './LevelNotesReducer';
import { combineReducers } from 'redux';

export interface RootReducerState {
  levelStars: LevelStarsReducerState;
  levelNotes: LevelNotesReducerState;
}
export const reducers = combineReducers({
  levelStars: levelStarsReducer,
  levelNotes: levelNotesReducer,
});
