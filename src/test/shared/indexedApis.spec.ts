import { ETIndexedDBCalc } from '../../shared/indexedApis';

const mockFetchTodoList = () => [
  {
    id: 1,
    date: '2023-08-08',
    todo: 'Go to grocery store',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 3,
  },
  {
    id: 2,
    date: '2023-08-08',
    todo: 'Go to Gym',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 1,
  },
  {
    id: 3,
    date: '2023-08-13',
    todo: 'Go to institute',
    createdAt: new Date('Dec 28, 2022 18:00:30'),
    duration: 60 * 60 * 2,
    done: true,
    categories: null,
    focusTime: 0,
    order: null,
  },
  {
    id: 4,
    date: '2023-08-13',
    todo: 'Go to grocery store',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 2,
  },
  {
    id: 5,
    date: '2023-08-13',
    todo: 'write test code',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 6,
  },
  {
    id: 6,
    date: '2023-08-14',
    todo: 'work ET',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 4,
  },
  {
    id: 7,
    date: '2023-08-14',
    todo: 'go to gym',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 5,
  },
  {
    id: 8,
    date: '2023-08-15',
    todo: 'Go to grocery store',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 60 * 60,
    done: false,
    categories: null,
    focusTime: 0,
    order: 7,
  },
];

describe('ExtremeTodoIndexedDB', () => {
  let mockTodoList: ReturnType<typeof mockFetchTodoList>;
  let indexedApis: ETIndexedDBCalc;

  beforeAll(() => {
    mockTodoList = mockFetchTodoList();
    indexedApis = new ETIndexedDBCalc();
  });

  describe('filterDone', () => {
    it('Done이 true인 한 개의 todo만 반환된다.', () => {
      const filtered = indexedApis.filterDone(true, mockTodoList);
      expect(filtered.length).toBe(1);
    });
  });
  describe('orderedList', () => {
    it('order의 오름차순에 따라 리스트를 정렬한다.', () => {
      const ordered = indexedApis.orderedList(mockTodoList);
      expect(ordered[0].order).toBe(1);
    });
  });
});
