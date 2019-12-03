import { LevelMappingsActions } from './LevelInfosActions';
import { LevelInfo } from '../utils/levelMappings';

export interface LevelInfosReducerState {
  levelInfos: LevelInfo[];
}

export interface NotesSpec {
  levelNumber: number;
  noteSequence: SequenceNote;
}

const INITIAL_LEVEL_INFOS_STATE: LevelInfosReducerState = {
  levelInfos: new Array<LevelInfo>(0),
};

interface LevelMappingAction {
  type: LevelMappingsActions;
  levelInfo: LevelInfo;
}

export const levelInfosReducer = (
  state: LevelInfosReducerState = INITIAL_LEVEL_INFOS_STATE,
  action: LevelMappingAction,
) => {
  switch (action.type) {
    case LevelMappingsActions.ADD_LEVEL_INFO: {
      const newArray = state.levelInfos.slice();
      newArray.push(action.levelInfo);
      return {
        ...state,
        levelInfos: newArray,
      };
    }
    case LevelMappingsActions.CLEAR_LEVEL_INFO: {
      return {
        ...state,
        levelInfos: INITIAL_LEVEL_INFOS_STATE.levelInfos,
      };
    }
    default: {
      return state;
    }
  }
};
