const DBNAME = 'extreme';
const STORENAME = 'todos';

// todo api만 셋팅해 두면 되지 않을까?
// QUESTION : 새벽 5시 마다 리셋시키는 타이머는 어떻게 하지?.. CRON
// QUESTION : IDB를 사용하다가 회원가입을 하면 이때까지 작성해 둔 TODO는 날라가는 것일까?..
// TODO : 백엔드 코드를 참고해서 만들면서, 계산과 액션의 분리를 좀 더 꼼꼼히 해서 나중에 백엔드 코드에 다시 반영을 시킬 수 있도록 하자

/* 
addTodo * Action_add
getOneTodo
removeTodoOrder
deleteTodo
minusOrder
updateTodo
doTodo
getList <- Action_getAll + Calc_orderedList
groupByDate
reorderTodos
todosToUpdate
updateOrder
removeTodos
resetTodos
*/

interface TodoEntity {
  id: number;
  date: string;
  todo: string;
  createdAt: Date;
  duration: number;
  done: boolean;
  categories: string[] | null;
  focusTime: number;
  order: number | null;
}

interface AddTodoDto
  extends Omit<TodoEntity, 'id' | 'date' | 'createdAt' | 'focusTime' | 'done'> {
  date: Date; // @Transform(({ value }) => new Date(value))
}

const MAX_CATEGORY_LENGTH = 5;

class ETIndexedDBAction {
  // 초기화
  constructor(
    private db: IDBDatabase | null = null,
    public request = indexedDB.open(DBNAME, 1),
  ) {
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORENAME)) {
        db.createObjectStore(STORENAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    // 에러처리
    request.onerror = (event) => {
      throw new Error('IDB open Fail', {
        cause: (event.target as IDBOpenDBRequest).error,
      });
    };
  }

  // addTodo
  add(todo: AddTodoDto) {
    if (!this.db) throw new Error('DB hasnt been initialized yet');
    if (todo.categories && todo.categories.length > MAX_CATEGORY_LENGTH) {
      return alert('카테고리는 최대 5개 까지 설정할 수 있습니다.');
    }

    const transaction = this.db.transaction([STORENAME], 'readwrite');
    const todoStore = transaction.objectStore(STORENAME);
    // TODO : 새로운 order 정보를 받아서 TODO Entity를 만들자
    const newTodo = {
      ...todo,
      createdAt: new Date(),
      done: false,
      focusTime: 0,
    };
    todoStore.add(newTodo);
  }

  // getList
  getAll(): Promise<TodoEntity[]> {
    // return await this.repo.find({

    //   order: { date: 'ASC', order: 'ASC' },
    // });

    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error('DB hasnt been initialized yet');

      const transaction = this.db.transaction(STORENAME, 'readonly');
      const objectStore = transaction.objectStore(STORENAME);
      const todoStore = objectStore.getAll();

      todoStore.onsuccess = (event) => {
        // const fetchData = (event.target as IDBRequest<TodoEntity[]>).result;
        // const doneTodos = this.Calc.filterDone(true, fetchData);
        // resolve(this.Calc.orderedList(doneTodos));
        resolve((event.target as IDBRequest<TodoEntity[]>).result);
      };

      todoStore.onerror = (event) => {
        reject(
          new Error('error fetching todo list', {
            cause: (event.target as IDBRequest).error,
          }),
        );
      };
    });
  }
}

class ETIndexedDBCalc {
  filterDone(isDone: boolean, todoList: TodoEntity[]): TodoEntity[] {
    return todoList.filter((todo) => todo.done === isDone);
  }

  orderedList(todoList: TodoEntity[]): TodoEntity[] {
    return todoList.sort((a, b) => (a.order as number) - (b.order as number));
  }

  // QUESTION : date 타입을 string으로 해도.. 문제가 없겠지?.. 나중에 nest 서버랑 같이 쓴다고 했을 때도 문제가 없겠지?..
  groupByDate(todoList: TodoEntity[]): Map<string, TodoEntity[]> {
    const mapped = new Map<string, TodoEntity[]>();
    for (const todo of todoList) {
      const index = mapped.get(todo.date) || [];
      index.push(todo);
      mapped.set(todo.date, index);
    }
    return mapped;
  }
}

export { ETIndexedDBCalc };
