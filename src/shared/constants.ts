import { ICategory } from './interfaces';

export const ONE_SECOND = 60000;

export const responsiveBreakpoints = {
  mobile: {
    min: 0,
    max: 479,
  },
  tablet_v: {
    min: 480,
    max: 767,
  },
  tablet_h: {
    min: 768,
    max: 1279,
  },
  desktop: {
    min: 1024,
    max: 1279,
  },
};

export const initialCategories: ICategory[] = [{ name: '', id: 0 }];

export const dummyCategories: ICategory[] = [
  { name: '공부', id: 0 },
  { name: '개발', id: 1 },
  { name: '음악', id: 2 },
  { name: '놀기', id: 3 },
  { name: '업무', id: 4 },
  { name: '장보기', id: 5 },
  { name: '잘살기', id: 6 },
  { name: '집안일', id: 7 },
  { name: '정신수양', id: 8 },
  { name: '필살기연구', id: 9 },
  { name: '2023', id: 10 },
  { name: '6월스터디', id: 11 },
  { name: '7월스터디', id: 12 },
  { name: '약속', id: 13 },
  { name: '리액트', id: 14 },
];
