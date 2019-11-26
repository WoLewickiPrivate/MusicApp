export interface CreateSongParams {
  id: string;
  startTime: string;
  stopTime: string;
  token: string;
}

const getSong = async (endpoint: string): Promise<SequenceNote> => {
  try {
    const response = await fetch(
      `https://musicapp-bck.herokuapp.com/${endpoint}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    return response.status as SequenceNote;
  } catch (error) {
    throw Error(error);
  }
};

const createSong = async (params: CreateSongParams): Promise<SequenceNote> => {
  try {
    const response = await fetch(
      `https://musicapp-bck.herokuapp.com/songs/create_song?song_id=${params.id}&start_time=${params.startTime}&stop_time=${params.stopTime}/`,
      {
        method: 'GET',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${params.token}`,
        },
      },
    );
    if (response.status >= 400) {
      console.warn('401');
      return require('../static/sounds/output.json');
    }
    return response as SequenceNote;
  } catch (error) {
    return require('../static/sounds/output.json');
  }
};

const getToken = async (): Promise<string> => {
  try {
    const response = await fetch(
      `https://musicapp-bck.herokuapp.com/auth/token/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'wojtek',
          password: 'wlewicki123',
        }),
      },
    );
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
      `https://musicapp-bck.herokuapp.com/songs/download/?song_id=${levelNumber +
        33}`,
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

export { getSong, getToken, createSong, fetchNotes };
