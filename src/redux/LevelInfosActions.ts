import { LevelInfo } from '../utils/levelMappings';

export enum LevelMappingsActions {
  ADD_LEVEL_INFO = 'ADD_LEVEL_INFO',
  CLEAR_LEVEL_INFO = 'CLEAR_LEVEL_INFO',
}

export const addLevelInfo = (levelInfo: LevelInfo) => {
  return { type: LevelMappingsActions.ADD_LEVEL_INFO, levelInfo };
};

export const clearLevelInfo = () => {
  return { type: LevelMappingsActions.CLEAR_LEVEL_INFO, levelInfo: [] };
};
