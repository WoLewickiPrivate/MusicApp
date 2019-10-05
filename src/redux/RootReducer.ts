import { starsReducer, StarsReducerState } from './StarsReducer';
import { levelStarsReducer, LevelStarsReducerState } from './LevelStarsReducer';
import { combineReducers } from 'redux';

export interface RootReducerState {
  stars: StarsReducerState;
  levelStars: LevelStarsReducerState;
}
export const reducers = combineReducers({
  stars: starsReducer,
  levelStars: levelStarsReducer,
});
