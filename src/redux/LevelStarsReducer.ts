import { LevelStarsActions } from './LevelStarsActions';
import { LevelStars } from '../utils/levelMappings';

export interface LevelStarsReducerState {
  levelStars: LevelStars[];
}

const INITIAL_LEVEL_STARS_STATE: LevelStarsReducerState = {
  levelStars: new Array<LevelStars>(0),
};

interface LevelStarsAction {
  type: LevelStarsActions;
  levelStars: LevelStars;
}

export const levelStarsReducer = (
  state: LevelStarsReducerState = INITIAL_LEVEL_STARS_STATE,
  action: LevelStarsAction,
) => {
  switch (action.type) {
    case LevelStarsActions.CHANGE_LEVEL_STARS: {
      const newArray: LevelStars[] = state.levelStars.slice();
      let didFind = false;
      for (let levelStars of newArray) {
        if (levelStars.song_id === action.levelStars.song_id) {
          didFind = true;
          levelStars.high_score = action.levelStars.high_score;
        }
      }
      if (!didFind) {
        newArray.push(action.levelStars);
      }
      return {
        levelStars: newArray,
      };
    }
    case LevelStarsActions.CLEAR_STARS: {
      return {
        levelStars: INITIAL_LEVEL_STARS_STATE.levelStars,
      };
    }
    default: {
      return state;
    }
  }
};
