import { Credentials } from '../redux/CredentialsReducer';

export interface CreateSongParams {
  id: string;
  startTime: string;
  stopTime: string;
  token: string;
}

const serverApi = 'https://musicapp-bck.herokuapp.com/';

const getSong = async (endpoint: string): Promise<SequenceNote> => {
  try {
    const response = await fetch(`${serverApi}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.status as SequenceNote;
  } catch (error) {
    throw Error(error);
  }
};

const createSong = async (params: CreateSongParams): Promise<SequenceNote> => {
  try {
    const response = await fetch(
      `${serverApi}songs/create_song?song_id=${params.id}&start_time=${params.startTime}&stop_time=${params.stopTime}/`,
      {
        method: 'GET',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${params.token}`,
        },
      },
    );
    if (response.status >= 400) {
      return require('../static/sounds/output.json');
    }
    return response as SequenceNote;
  } catch (error) {
    return require('../static/sounds/output.json');
  }
};

const getToken = async (credentials: Credentials): Promise<string> => {
  try {
    const response = await fetch(`${serverApi}auth/token/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.login,
        password: credentials.password,
      }),
    });
    const responseBody = await response.json();
    return responseBody['token'];
  } catch (error) {
    throw new Error(error);
  }
};

const fetchNotes = async (
  levelNumber: number,
  token: string,
): Promise<SequenceNote> => {
  try {
    const response = await fetch(
      `${serverApi}songs/download/?song_id=${levelNumber + 33}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.status >= 400) {
      return require('../static/sounds/output.json');
    }
    const responseBody = await response.json();
    return responseBody;
  } catch (error) {
    return require('../static/sounds/output.json');
  }
};

const tryLogin = async (login: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${serverApi}auth/token/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: login,
        password: password,
      }),
    });
    if (response.status >= 400) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const tryRegister = async (
  login: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
): Promise<boolean> => {
  try {
    const response = await fetch(`${serverApi}auth/register/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: login,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    if (response.status >= 400) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export { getSong, getToken, createSong, fetchNotes, tryLogin, tryRegister };
