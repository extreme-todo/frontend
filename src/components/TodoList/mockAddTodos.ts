import { AddTodoDto } from '../../DB/indexed';

export const addTodoMocks = (): AddTodoDto[] => {
  return [
    {
      date: '2024-06-11T15:00:00Z',
      todo: 'practice valorant',
      duration: 1,
      categories: ['game', 'practice'],
    },
    {
      date: '2024-06-16T15:00:00Z',
      todo: 'go to grocery store',
      duration: 2,
      categories: ['chore'],
    },
    {
      date: '2024-06-11T15:00:00Z',
      todo: 'Watch English News',
      duration: 1,
      categories: ['english', 'study'],
    },
    {
      date: '2024-06-16T15:00:00Z',
      todo: 'Start Exercise',
      duration: 1,
      categories: ['health'],
    },
    {
      date: '2024-06-20T15:00:00Z',
      todo: 'check riff',
      duration: 0.05,
      categories: [
        'music',
        'guitar',
        'music theory',
        'hubby',
        'lorem ipsum sth sth',
      ],
    },
    {
      date: '2024-06-21T15:00:00Z',
      todo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      duration: 3,
      categories: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        'guitar',
      ],
    },
  ];
};
