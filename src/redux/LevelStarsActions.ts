import { LevelSpec } from './LevelStarsReducer';

export enum LevelStarsActions {
  ADD_STARS_TO_LEVEL = 'ADD_STARS_TO_LEVEL',
}

export const addStarsToLevel = (levelSpec: LevelSpec) => {
  return { type: LevelStarsActions.ADD_STARS_TO_LEVEL, levelSpec };
};
