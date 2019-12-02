import { CredentialsActions } from './CredentialsActions';

export interface CredentialsReducerState {
  credentials: Credentials;
}

export interface Credentials {
  login: string;
  password: string;
}

const INITIAL_CREDENTIALS_STATE: CredentialsReducerState = {
  credentials: {
    login: '',
    password: '',
  },
};

interface CredentialsAction {
  type: CredentialsActions;
  credentials: Credentials;
}

export const credentialsReducer = (
  state: CredentialsReducerState = INITIAL_CREDENTIALS_STATE,
  action: CredentialsAction,
) => {
  switch (action.type) {
    case CredentialsActions.CHANGE_CREDENTIALS: {
      return {
        ...state,
        credentials: {
          login: action.credentials.login,
          password: action.credentials.password,
        },
      };
    }
    default: {
      return state;
    }
  }
};
