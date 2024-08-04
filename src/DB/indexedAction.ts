import type { AddTodoDto } from './indexed';

type CategoryType = { id: number; name: string };

interface TodoEntity {
  id: string;
  date: string; // toISOstring() 처리된 Date
  todo: string;
  createdAt: Date;
  duration: number;
  done: boolean;
  categories: string[] | null;
  focusTime: number;
  order: number | null;
}

type TransactionMode = 'readonly' | 'readwrite';
type CrudType = 'add' | 'get' | 'update' | 'remove';

const DBNAME = 'extreme';
const STORENAME = 'todos';
const MAX_CATEGORY_LENGTH = 5;

class ETIndexedDBAction {
  // 초기화
  constructor(
    private db: IDBDatabase | null = null,
    public request = indexedDB.open(DBNAME, 1),
    public isInit = false,
  ) {
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORENAME)) {
        db.createObjectStore(STORENAME, {
          keyPath: 'id',
        });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.isInit = true;
    };

    // 에러처리
    request.onerror = (event) => {
      throw new Error('IDB open Fail', {
        cause: (event.target as IDBOpenDBRequest).error,
      });
    };
  }

  public waitForInit() {
    return new Promise<boolean>((resolve, reject) => {
      let count = 0;
      const checkIsInit = () => {
        if (this.isInit) {
          resolve(true);
        } else {
          if (count > 10) {
            return reject(false);
          }
          count++;
          setTimeout(() => {
            checkIsInit();
          }, 100);
        }
      };

      checkIsInit();
    });
  }

  private getObjectStore(mode: TransactionMode) {
    if (!this.db) throw new Error('DB hasnt been initialized yet');
    const transaction = this.db?.transaction([STORENAME], mode);
    const objectStore = transaction.objectStore(STORENAME);
    return objectStore;
  }

  private makePromise<T>(request: IDBRequest, action: CrudType): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) =>
        resolve((event.target as IDBRequest<T>).result);
      request.onerror = (event) =>
        reject(
          new Error(`Fail to ${action} todo`, {
            cause: (event.target as IDBRequest).error,
          }),
        );
    });
  }

  // addTodo
  // TODO : 나중에 백엔드에서 데이터를 만들고 indexed에 동기화를 할 때도
  // add를 사용해서 indexedDB에 데이터를 추가할 예정
  add(todo: TodoEntity): Promise<void> {
    if (todo.categories && todo.categories.length > MAX_CATEGORY_LENGTH) {
      return Promise.reject(
        new Error('Fail to add todo', {
          cause: '카테고리는 최대 5개 까지 설정할 수 있습니다.',
        }),
      );
    }

    const objectStore = this.getObjectStore('readwrite');
    const todoRequest = objectStore.add(todo);
    const promisedTodo = this.makePromise<void>(todoRequest, 'add');
    return promisedTodo;
  }

  // getList
  getAll(): Promise<TodoEntity[]> {
    // return await this.repo.find({
    //   order: { date: 'ASC', order: 'ASC' }, // -> 순서대로 정렬을 하고 나면 날짜별로도 됐을 거임
    // });
    const objectStore = this.getObjectStore('readonly');
    const todoRequest = objectStore.getAll();
    const promisedTodo = this.makePromise<TodoEntity[]>(todoRequest, 'get');
    return promisedTodo;
  }

  getOne(id: string): Promise<TodoEntity> {
    const objectStore = this.getObjectStore('readonly');
    const todoRequest = objectStore.get(id);
    const promisedTodo = this.makePromise<TodoEntity>(todoRequest, 'get');
    return promisedTodo;
  }

  removeOne(id: string): Promise<void> {
    const objectStore = this.getObjectStore('readwrite');
    const todoRequest = objectStore.delete(id);
    const promisedTodo = this.makePromise<void>(todoRequest, 'remove');
    return promisedTodo;
  }

  resetAll(): Promise<void> {
    const objectStore = this.getObjectStore('readwrite');
    const todoRequest = objectStore.clear();
    const promisedTodo = this.makePromise<void>(todoRequest, 'remove');
    return promisedTodo;
  }

  updateOne(todo: TodoEntity): Promise<TodoEntity> {
    if (todo.categories && todo.categories.length > MAX_CATEGORY_LENGTH) {
      return Promise.reject(
        new Error('Fail to add todo', {
          cause: '카테고리는 최대 5개 까지 설정할 수 있습니다.',
        }),
      );
    }
    const objectStore = this.getObjectStore('readwrite');
    const todoRequest = objectStore.put(todo);
    const promisedTodo = this.makePromise<TodoEntity>(todoRequest, 'update');
    return promisedTodo;
  }
}

export { ETIndexedDBAction };
export type { TodoEntity, CategoryType };
