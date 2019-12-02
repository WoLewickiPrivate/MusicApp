import { combineReducers } from 'redux';

import { levelStarsReducer, LevelStarsReducerState } from './LevelStarsReducer';
import { levelNotesReducer, LevelNotesReducerState } from './LevelNotesReducer';
import {
  credentialsReducer,
  CredentialsReducerState,
} from './CredentialsReducer';

export interface RootReducerState {
  levelStars: LevelStarsReducerState;
  levelNotes: LevelNotesReducerState;
  credentials: CredentialsReducerState;
}
export const reducers = combineReducers({
  levelStars: levelStarsReducer,
  levelNotes: levelNotesReducer,
  credentials: credentialsReducer,
});
