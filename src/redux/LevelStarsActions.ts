import { LevelStars } from '../utils/levelMappings';

export enum LevelStarsActions {
  CHANGE_LEVEL_STARS = 'CHANGE_LEVEL_STARS',
  CLEAR_STARS = 'CLEAR_STARS',
}

export const addStarsToLevel = (levelStars: LevelStars) => {
  return { type: LevelStarsActions.CHANGE_LEVEL_STARS, levelStars };
};

export const clearStars = () => {
  return { type: LevelStarsActions.CLEAR_STARS, levelStars: [] };
};
