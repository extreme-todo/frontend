import { z } from 'zod';

type CategoryType = { id: number; name: string };

export const unicodeLetterReg = new RegExp('^[\\p{L}\\p{M}\\s]+$', 'u');
export const TITLE_EMPTY_MESSAGE = '제목을 입력해주세요.';
export const MAX_CATEGORY_INPUT_LENGTH = 20;
export const SPECIAL_EXPRESSION_WARNING = `특수문자는 입력할 수 없습니다\n!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
const trimStr = (str: unknown) => {
  return String(str).replace(/\s+/g, ' ').trim();
};

export const CategoryInputSchema = z.preprocess(
  trimStr,
  z
    .string()
    .max(
      MAX_CATEGORY_INPUT_LENGTH,
      `${MAX_CATEGORY_INPUT_LENGTH}자 이하로만 입력할 수 있습니다.`,
    )
    .regex(unicodeLetterReg, SPECIAL_EXPRESSION_WARNING),
);
export const TodoSchema = z.object({
  todo: z.preprocess(trimStr, z.string().min(1, TITLE_EMPTY_MESSAGE)),
  categories: z.array(CategoryInputSchema).nullable(),
  duration: z.coerce
    .number()
    .min(1, '유효한 토마토 값이 아닙니다.')
    .max(10, '유효한 토마토 값이 아닙니다.'),
  date: z.string().datetime({ offset: true }),
  focusTime: z.number().min(0).default(0),
  order: z.number().nullable(),
  done: z.boolean().default(false),
  createdAt: z.coerce.date(),
  id: z.string().uuid(),
});

type TodoEntity = z.infer<typeof TodoSchema>;

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
