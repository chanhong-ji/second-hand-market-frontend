import { atom } from 'recoil';

export const followingCountState = atom({
  key: 'followingCount',
  default: 0,
});

export const interestCountState = atom({
  key: 'interestCount',
  default: 0,
});
