import { StarsActions } from './StarsActions';

export interface StarsReducerState {
  starsCount: number;
}

const INITIAL_STARS_STATE: StarsReducerState = {
  starsCount: 0,
};

interface StarsAction {
  type: StarsActions;
  count: number;
}

export const starsReducer = (
  state: StarsReducerState = INITIAL_STARS_STATE,
  action: StarsAction,
) => {
  switch (action.type) {
    case StarsActions.ADD_STARS: {
      return { starsCount: state.starsCount + action.count };
    }
    default: {
      return state;
    }
  }
};
