import { LevelStarsActions } from './LevelStarsActions';

export interface LevelStarsReducerState {
  levelStarsCount: number[];
}

export interface LevelSpec {
  levelNumber: number;
  starsGained: number;
}

const INITIAL_LEVEL_STARS_STATE: LevelStarsReducerState = {
  // first one is never used cause there is no level 0
  levelStarsCount: [0, 0, 0],
};

interface LevelStarsAction {
  type: LevelStarsActions;
  levelSpec: LevelSpec;
}

export const levelStarsReducer = (
  state: LevelStarsReducerState = INITIAL_LEVEL_STARS_STATE,
  action: LevelStarsAction,
) => {
  switch (action.type) {
    case LevelStarsActions.TRY_ADD_STARS_TO_LEVEL: {
      const newArray: number[] = state.levelStarsCount.slice();
      newArray[action.levelSpec.levelNumber] = action.levelSpec.starsGained;
      return {
        levelStarsCount: newArray,
      };
    }
    default: {
      return state;
    }
  }
};
