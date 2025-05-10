import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Cancel,
} from 'axios';
import LoginEvent from './LoginEvent';

import { CategoryType, TodoEntity } from '../DB/indexedAction';
import { UpdateTodoDto, type AddTodoDto } from '../DB/indexed';
import { ICategory, IFocusTime, ISettings } from './interfaces';
import { groupByDate } from './timeUtils';
import { RandomTagColorList } from './RandomTagColorList';

const SERVER_URL = process.env.REACT_APP_API_SERVER_URL;
const MAX_RETRY_COUNT = 2;
const DIDNT_LOGIN_USER = '로그인이 필요합니다.';
const EXTREME_TOKEN_HEADER = 'extreme-token';
const EXTREME_EMAIL_HEADER = 'extreme-email';
export const EXTREME_TOKEN_STORAGE = 'extremeToken';
export const EXTREME_EMAIL_STORAGE = 'extremeEmail';
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
  const accessToken = localStorage.getItem(EXTREME_TOKEN_STORAGE);
  const email = localStorage.getItem(EXTREME_EMAIL_STORAGE);
  if (
    config.url !== '/api/users/callback/google/start' &&
    !email &&
    !accessToken
  ) {
    throw new axios.Cancel(DIDNT_LOGIN_USER);
  }
  if (config.headers) {
    config.headers[EXTREME_TOKEN_HEADER] = accessToken
      ? accessToken
      : (false as boolean);
    config.headers[EXTREME_EMAIL_HEADER] = email ? email : (false as boolean);
  }
  return config;
});

baseApi.interceptors.response.use(
  (config) => {
    if (EXTREME_TOKEN_HEADER in config.headers)
      localStorage.setItem(
        EXTREME_TOKEN_STORAGE,
        config.headers[EXTREME_TOKEN_HEADER],
      );

    return config;
  },
  (err: AxiosError) => {
    if (err.message === DIDNT_LOGIN_USER) return Promise.reject(err);
    const config = err.config as AxiosCustomRequest;
    config.retryCount = config.retryCount ?? 0;

    const shouldRetry = config.retryCount < MAX_RETRY_COUNT;
    if (shouldRetry) {
      config.retryCount += 1;
      return axios(config);
    }
    if (err.response?.status === 401) {
      localStorage.removeItem(EXTREME_EMAIL_STORAGE);
      localStorage.removeItem(EXTREME_TOKEN_STORAGE);
      window.alert('다시 로그인 해주세요');
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
  _ramdomTagColorList: RandomTagColorList.getInstance(),
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
          (category) => {
            this._ramdomTagColorList.setColor = category.name;
            return category.name;
          },
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
  // duration in minutes
  recordFocusTime: async (category: string, duration: number) => {
    return baseApi.post(`${timerApi._route}/focused-time`, {
      category,
      duration,
    });
  },
  getRecords: async (
    timezoneOffset: number,
    unit: 'week' | 'month' | 'day',
    categoryId?: number,
  ) => {
    return baseApi.get<IFocusTime>(`${timerApi._route}/focused-time`, {
      params: { timezoneOffset, unit, categoryId },
    });
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
