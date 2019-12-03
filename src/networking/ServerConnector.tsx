import { Credentials } from '../redux/CredentialsReducer';

export interface CreateSongParams {
  id: string;
  startTime: string;
  stopTime: string;
  token: string;
}

export interface SongStatsParams {
  song_id: number;
  practice_time: number;
  high_score: number;
}

const serverApi = 'https://musicapp-bck.herokuapp.com/';

const createSong = async (params: CreateSongParams): Promise<SequenceNote> => {
  try {
    const response = await fetch(
      `${serverApi}songs/create_song/?song_id=${params.id}&start_time=${params.startTime}&stop_time=${params.stopTime}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.token}`,
        },
      },
    );
    if (response.status >= 400) {
      return require('../static/sounds/output.json');
    }
    return await response.json();
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
    return '';
  }
};

const fetchNotes = async (
  levelNumber: number,
  token: string,
): Promise<SequenceNote> => {
  try {
    const response = await fetch(
      `${serverApi}songs/download/?song_id=${levelNumber}`,
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

const tryLogin = async (
  login: string,
  password: string,
): Promise<{ didSuccess: boolean; token: string }> => {
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
      return {
        didSuccess: false,
        token: '',
      };
    }
    const responseBody = await response.json();
    return {
      didSuccess: true,
      token: responseBody['token'],
    };
  } catch (error) {
    return {
      didSuccess: false,
      token: '',
    };
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

const fetchLevels = async (token: string) => {
  try {
    const response = await fetch(`${serverApi}songs/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status >= 400) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
};

const fetchUserStars = async (token: string) => {
  try {
    const response = await fetch(`${serverApi}songstats/all_songs/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status >= 400) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
};

const sendLevelStatistics = async (token: string, stats: SongStatsParams) => {
  try {
    const response = await fetch(
      `${serverApi}songstats/?song_id=${stats.song_id}&practice_time=${stats.practice_time}&high_score=${stats.high_score}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.status >= 400) {
      return;
    }
    return await response.json();
  } catch (error) {}
};

export {
  getToken,
  createSong,
  fetchNotes,
  tryLogin,
  tryRegister,
  fetchLevels,
  fetchUserStars,
  sendLevelStatistics,
};
