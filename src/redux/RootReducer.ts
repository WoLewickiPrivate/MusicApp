import { combineReducers } from 'redux';

import { levelStarsReducer, LevelStarsReducerState } from './LevelStarsReducer';
import { levelInfosReducer, LevelInfosReducerState } from './LevelInfosReducer';
import {
  credentialsReducer,
  CredentialsReducerState,
} from './CredentialsReducer';

export interface RootReducerState {
  levelStars: LevelStarsReducerState;
  levelInfos: LevelInfosReducerState;
  credentials: CredentialsReducerState;
}
export const reducers = combineReducers({
  levelStars: levelStarsReducer,
  levelInfos: levelInfosReducer,
  credentials: credentialsReducer,
});
