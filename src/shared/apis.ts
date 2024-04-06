import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import LoginEvent from './LoginEvent';
import { dummyRanking } from './constants';
import { IRanking } from './interfaces';
import { type AddTodoDto } from '../DB/indexed';

const SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

interface AxiosCustomRequest extends AxiosRequestConfig {
  retryCount: number;
}

const LOGINEVENT = LoginEvent.getInstance();

const MAX_RETRY_COUNT = 2;

const baseApi = axios.create({
  // TODO : 배포 시 수정할 것
  baseURL: 'https://' + SERVER_URL + '/api',
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
  async addTodo(todo: AddTodoDto) {},
};
export const timerApi = {};
export const settingsApi = {};
