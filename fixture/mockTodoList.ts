import { AddTodoDto } from '../src/DB/indexed';
import { TodoEntity } from '../src/DB/indexedAction';

const mockFetchTodoList = (): TodoEntity[] => [
  {
    id: 1,
    date: '2023-08-08',
    todo: 'Go to grocery store',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 3,
    done: false,
    categories: ['영어', '학교공부'],
    focusTime: 0,
    order: 3,
  },
  {
    id: 2,
    date: '2023-08-08',
    todo: 'Go to Gym',
    createdAt: new Date('Dec 26, 2022 18:00:30'),
    duration: 6,
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
    duration: 2,
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
    duration: 5,
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
    duration: 3,
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
    duration: 4,
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
    duration: 2,
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
    duration: 5,
    done: false,
    categories: null,
    focusTime: 0,
    order: 7,
  },
];

const addTodoMock = (): AddTodoDto => {
  return {
    date: '2023-08-15',
    todo: 'Go to grocery store',
    duration: 4,
    categories: null,
  };
};

export { mockFetchTodoList, addTodoMock };
