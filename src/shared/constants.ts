import { ICategory, IRanking, IRecords } from './interfaces';

export const ONE_SECOND = 60000;

export const initialRecords: IRecords = {
  daily: 0,
  weekly: 0,
  monthly: 0,
};

export const dummyRecords: IRecords = {
  daily: 305,
  weekly: 2433,
  monthly: -5034,
};

export const initialRanking: IRanking = {
  group: [{ '0': 0 }],
  user: {
    id: 0,
    time: 0,
  },
};

export const dummyRanking: IRanking = {
  group: [
    {
      '0~600': 1,
      '600~1200': 3,
      '1200~1800': 2,
      '1800~2400': 5,
      '2400~3000': 3,
      '3000~3600': 1,
      '3600~4200': 1,
      '4200~4800': 2,
      '4800~5400': 3,
      '5400~6000': 6,
    },
  ],
  user: {
    id: 123,
    time: 5612,
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
