export enum StarsActions {
  ADD_STARS = 'ADD_STARS',
}

export const addStars = (count: number) => {
  return { type: StarsActions.ADD_STARS, count };
};
