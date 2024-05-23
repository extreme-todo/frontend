import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import LoginEvent from './LoginEvent';

import { CategoryType, TodoEntity } from '../DB/indexedAction';
import { UpdateTodoDto, type AddTodoDto } from '../DB/indexed';
import { ISettings } from './interfaces';
import { groupByDate } from './timeUtils';

const SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

interface AxiosCustomRequest extends AxiosRequestConfig {
  retryCount: number;
}

const LOGINEVENT = LoginEvent.getInstance();

const MAX_RETRY_COUNT = 2;

const baseApi = axios.create({
  // TODO : 배포 시 수정할 것
  baseURL: 'http://' + SERVER_URL + '/api', // 로컬에서는 http로 해야 됨!
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    accept: 'application/json',
  },
  timeout: 7000,
});

baseApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('extremeToken');
  const email = localStorage.getItem('extremeEmail');

  if (config.headers) {
    config.headers['extreme-token'] = accessToken
      ? accessToken
      : (false as boolean);
    config.headers['extreme-email'] = email ? email : (false as boolean);
  }
  return config;
});

baseApi.interceptors.response.use(
  (config) => {
    return config;
  },
  (err: AxiosError) => {
    const config = err.config as AxiosCustomRequest;
    config.retryCount = config.retryCount ?? 0;

    const shouldRetry = config.retryCount < MAX_RETRY_COUNT;
    if (shouldRetry) {
      config.retryCount += 1;
      return axios(config);
    }
    return Promise.reject(err);
  },
);

export const usersApi = {
  login() {
    const data = window.open(
      'http://' + SERVER_URL + '/api/users/callback/google/start',
      '_self',
    );
    return data;
  },
  logout(): void {
    localStorage.removeItem('extremeEmail');
    window.dispatchEvent(LOGINEVENT.getEvent());
    localStorage.removeItem('extremeToken');
  },
  async withdrawal() {
    await baseApi.post('users/revoke');
  },
};

export const todosApi = {
  _route: '/todos',

  getRanking: async (category: string) => {
    return baseApi.get('ranking', { params: { category } });
  },
  getRecords: async () => {
    return baseApi.get('timer/progress');
  },
  getCategories: async () => {
    return baseApi.get('categories');
  },
  async reset() {
    await baseApi.delete('todos/reset');
  },
  async addTodo(todo: AddTodoDto) {
    await baseApi.post(this._route, todo);
  },
  async reorderTodos(prevOrder: number, newOrder: number) {
    await baseApi.patch(`${this._route}/reorder`, null, {
      params: {
        prevOrder,
        newOrder,
      },
    });
  },
  async updateTodo(id: number, todo: UpdateTodoDto) {
    await baseApi.patch(`${this._route}/${id}`, todo);
  },
  async getList(isDone: boolean): Promise<Map<string, TodoEntity[]>> {
    const { data } = await baseApi.get<
      any,
      AxiosResponse<(TodoEntity | { categories: CategoryType[] })[]>
    >(this._route, {
      params: { done: isDone ? 1 : 0 },
    });

    const modifiedCategories = data.map((todo) => {
      if (todo.categories && typeof todo.categories[0] !== 'string') {
        const stringified = (todo.categories as CategoryType[]).map(
          (category) => category.name,
        );
        return {
          ...todo,
          categories: stringified,
        } as TodoEntity;
      } else {
        return todo as TodoEntity;
      }
    });

    return groupByDate(modifiedCategories);
  },
};
export const timerApi = {
  _route: 'timer',
  addTotalFocusTime: async (addFocusTime: number) => {
    return baseApi.patch(`${timerApi._route}/total_focus`, { addFocusTime });
  },
  getTotalFocusTime: async () => {
    return baseApi.get(`${timerApi._route}/total_focus`);
  },
  addTotalRestTime: async (addRestTime: number) => {
    return baseApi.patch(`${timerApi._route}/total_rest`, { addRestTime });
  },
  getTotalRestTime: async () => {
    return baseApi.get(`${timerApi._route}/total_rest`);
  },
  reset: async () => {
    return baseApi.delete(`${timerApi._route}/reset`);
  },
  getProgress: async () => {
    return baseApi.get(`${timerApi._route}/progress`);
  },
};

export const rankingApi = {
  _route: 'ranking',
  getRanking: async (categoryName: string) => {
    return baseApi.get(`${rankingApi._route}?category=${categoryName}`);
  },
  resetRanking: async () => {
    return baseApi.delete(`${rankingApi._route}/reset`);
  },
};

export const settingsApi = {
  _route: 'settings',
  getSettings: async <T = ISettings>(): Promise<AxiosResponse<T, any>> => {
    return baseApi.get<T>(`${settingsApi._route}`);
  },
  setSettings: async (settingData: ISettings) => {
    return baseApi.put(`${settingsApi._route}`, settingData);
  },
};
