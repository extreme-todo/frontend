export const EXTREME_TOKEN_STORAGE = 'extremeToken';
export const EXTREME_EMAIL_STORAGE = 'extremeEmail';

export const usersApi = {
  login: jest.fn(),
  withdrawal: jest.fn(),
};

export const todosApi = {
  _randomTagColorList: {
    getInstance: jest.fn().mockReturnValue({
      setColor: jest.fn(),
    }),
  },
  resetTodos: jest.fn(),
  addTodo: jest.fn(),
  doTodo: jest.fn(),
  reorderTodos: jest.fn(),
  updateTodo: jest.fn(),
  getList: jest.fn().mockResolvedValue(new Map()),
  getOneTodo: jest.fn(),
  deleteTodo: jest.fn(),
  removeDidntDo: jest.fn(),
  doAllTodo: jest.fn(),
};

export const timerApi = {
  _route: 'timer',
  getRecords: jest.fn(),
  resetRecords: jest.fn(),
};

export const categoryApi = {
  getCategories: jest.fn(),
};

export const settingsApi = {
  _route: 'settings',
  getSettings: jest.fn().mockResolvedValue(null),
  setSettings: jest.fn(),
};
