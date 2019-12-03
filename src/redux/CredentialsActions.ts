import { Credentials } from './CredentialsReducer';

export enum CredentialsActions {
  CHANGE_CREDENTIALS = 'CHANGE_CREDENTIALS',
}

export const changeCredentials = (credentials: Credentials) => {
  return { type: CredentialsActions.CHANGE_CREDENTIALS, credentials };
};
