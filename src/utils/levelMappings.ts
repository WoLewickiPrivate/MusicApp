import { fetchLevels, fetchUserStars } from '../networking/ServerConnector';

export type LevelInfo = {
  id: number;
  name: string;
  level: 'Easy' | 'Medium' | 'Difficult';
  length: 'Short' | 'Medium' | 'Long';
};

export interface LevelStars {
  song_id: number;
  high_score: number;
}

async function prepareLevels(
  token: string,
  clearLevels: () => void,
  clearStars: () => void,
  addLevel: (levelInfo: LevelInfo) => void,
  changeStarsOfLevel: (levelStars: LevelStars) => void,
): Promise<void> {
  const levels: LevelInfo[] = await fetchLevels(token);
  clearLevels();
  clearStars();
  for (const levelInfo of levels) {
    addLevel(levelInfo);
  }
  const levelsStars: LevelStars[] = await fetchUserStars(token);
  for (const stars of levelsStars) {
    changeStarsOfLevel(stars);
  }
}

function mapIdToStars(songId: number, levelStars: LevelStars[]): number {
  for (const stars of levelStars) {
    if (songId === stars.song_id) {
      return stars.high_score;
    }
  }
  return 0;
}

export { prepareLevels, mapIdToStars };
