import { levelStarsReducer, LevelStarsReducerState } from './LevelStarsReducer';
import { combineReducers } from 'redux';

export interface RootReducerState {
  levelStars: LevelStarsReducerState;
}
export const reducers = combineReducers({
  levelStars: levelStarsReducer,
});
