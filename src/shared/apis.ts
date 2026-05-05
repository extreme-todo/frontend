import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { CategoryType, TodoEntity } from '../DB/indexedAction';
import { UpdateTodoDto, type AddTodoDto } from '../DB/indexed';
import { ICategory, IFocusTime, ISettings, IUser } from './interfaces';
import { groupByDate } from './timeUtils';
import { RandomTagColorList } from './RandomTagColorList';
import { queryClient } from '../App';

const SERVER_URL = process.env.REACT_APP_API_SERVER_URL;
const MAX_RETRY_COUNT = 2;

interface AxiosCustomRequest extends AxiosRequestConfig {
  retryCount: number;
}

let IS_INVALID_TOKEN = false;
let IS_LOGGING_OUT = false;

const baseApi = axios.create({
  baseURL: SERVER_URL + '/api',
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    accept: 'application/json',
  },
  timeout: 7000,
  withCredentials: true,
});

baseApi.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err: AxiosError) => {
    // 401 Unauthorized 처리
    if (err.response?.status === 401) {
      // 1. 'users/me' 또는 'users/logout' 요청은 실패해도 알림이나 새로고침을 하지 않음
      const isAuthPath =
        err.config?.url === 'users/me' || err.config?.url === 'users/logout';

      if (isAuthPath || IS_LOGGING_OUT) {
        return Promise.reject(err);
      }

      // 2. 이미 처리가 진행 중이거나, 로그인되지 않은 상태에서 발생한 다른 401 처리 방지
      if (IS_INVALID_TOKEN === false) {
        IS_INVALID_TOKEN = true;
        await queryClient.cancelQueries();
        window.alert('세션이 만료됐습니다!\n 다시 로그인 해주세요.');
        window.location.reload();
      }
      return Promise.reject(err);
    }

    const config = err.config as AxiosCustomRequest;
    if (!config) return Promise.reject(err);

    // 401이 아닌 다른 에러(네트워크 불안정 등)에 대해서만 Retry 수행
    config.retryCount = config.retryCount ?? 0;
    const shouldRetry = config.retryCount < MAX_RETRY_COUNT;
    if (shouldRetry) {
      config.retryCount += 1;
      return baseApi(config);
    }

    return Promise.reject(err);
  },
);

export const usersApi = {
  login() {
    IS_LOGGING_OUT = false;
    const data = window.open(
      SERVER_URL + '/api/users/callback/google/start',
      '_self',
    );
    return data;
  },
  async logout() {
    try {
      IS_LOGGING_OUT = true;
      return await baseApi.post('users/logout');
    } catch (error) {
      IS_LOGGING_OUT = false;
      throw error;
    }
  },
  async getMe() {
    return await baseApi.get<IUser>('users/me');
  },
  async withdrawal() {
    await baseApi.delete('users/revoke');
  },
};
// export const todosApi: TodoModuleType = {
export const todosApi = {
  _randomTagColorList: RandomTagColorList.getInstance(),
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
            this._randomTagColorList.setColor = category.name;
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
  async doAllTodo() {
    await baseApi.delete('/todos/undone/all');
  },
};
export const timerApi = {
  _route: 'timer',
  getRecords: async (
    timezoneOffset: number,
    unit: 'week' | 'month' | 'day',
    categoryId?: number,
  ) => {
    return baseApi.get<IFocusTime>(`${timerApi._route}/focused-time`, {
      params: { timezoneOffset, unit, categoryId },
    });
  },
  resetRecords: async () => {
    return baseApi.delete(`${timerApi._route}/focused-time`);
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
