import { LevelSpec } from './LevelStarsReducer';

export enum LevelStarsActions {
  TRY_ADD_STARS_TO_LEVEL = 'TRY_ADD_STARS_TO_LEVEL',
}

export const tryAddStarsToLevel = (levelSpec: LevelSpec) => {
  return { type: LevelStarsActions.TRY_ADD_STARS_TO_LEVEL, levelSpec };
};
