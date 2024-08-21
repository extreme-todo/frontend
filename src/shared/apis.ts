import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import LoginEvent from './LoginEvent';

import { CategoryType, TodoEntity } from '../DB/indexedAction';
import { UpdateTodoDto, type AddTodoDto } from '../DB/indexed';
import { ICategory, IRanking, ISettings } from './interfaces';
import { groupByDate } from './timeUtils';

const SERVER_URL = process.env.REACT_APP_API_SERVER_URL;
const MAX_RETRY_COUNT = 2;
const EXTREME_TOKEN = 'extreme-token';
const EXTREME_EMAIL = 'extreme-email';
const LOGINEVENT = LoginEvent.getInstance();

interface AxiosCustomRequest extends AxiosRequestConfig {
  retryCount: number;
}

const baseApi = axios.create({
  baseURL: SERVER_URL + '/api',
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
    config.headers[EXTREME_TOKEN] = accessToken
      ? accessToken
      : (false as boolean);
    config.headers[EXTREME_EMAIL] = email ? email : (false as boolean);
  }
  return config;
});

baseApi.interceptors.response.use(
  (config) => {
    if (EXTREME_TOKEN in config.headers)
      localStorage.setItem('extremeToken', config.headers[EXTREME_TOKEN]);

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
      SERVER_URL + '/api/users/callback/google/start',
      '_self',
    );
    return data;
  },
  async withdrawal() {
    await baseApi.delete('users/revoke');
  },
};
// export const todosApi: TodoModuleType = {
export const todosApi = {
  async resetTodos() {
    await baseApi.delete('todos/reset');
  },
  async addTodo(todo: AddTodoDto) {
    await baseApi.post('/todos', todo);
  },
  async doTodo(id: string, focusTime: number) {
    await baseApi.patch(`/todos/${id}/done`, null, {
      params: {
        focusTime,
      },
    });
  },
  async reorderTodos(prevOrder: number, newOrder: number) {
    await baseApi.patch(`/todos/reorder`, null, {
      params: {
        prevOrder,
        newOrder,
      },
    });
  },
  async updateTodo(id: string, todo: UpdateTodoDto): Promise<TodoEntity> {
    return await baseApi.patch(`/todos/${id}`, todo);
  },
  async getList(isDone: boolean): Promise<Map<string, TodoEntity[]>> {
    const { data } = await baseApi.get<
      any,
      AxiosResponse<(TodoEntity | { categories: CategoryType[] })[]>
    >('/todos', {
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
  async getOneTodo(id: string) {
    return await baseApi.get(`/todos/${id}`);
  },
  async deleteTodo(id: string) {
    await baseApi.delete(`/todos/${id}`);
  },
  async removeDidntDo(currentDate: string) {
    return await baseApi.delete('/todos', { params: { currentDate } });
  },
};
export const timerApi = {
  _route: 'timer',
  getRecords: async (currentDate: string, offset: number) => {
    return baseApi.get('timer/progress', {
      params: { currentDate, offset },
    });
  },
};

export const rankingApi = {
  _route: 'ranking',
  getRanking: async (categoryName: string) => {
    const { data: ranking }: AxiosResponse<IRanking> = await baseApi.get(
      `${rankingApi._route}?category=${categoryName}`,
    );
    return ranking;
  },
  resetRanking: async () => {
    return baseApi.delete(`${rankingApi._route}/reset`);
  },
};

export const categoryApi = {
  getCategories: async () => {
    const { data: categories }: AxiosResponse<ICategory[]> = await baseApi.get(
      'categories',
    );
    return categories;
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
