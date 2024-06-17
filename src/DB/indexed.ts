// todo api만 셋팅해 두면 되지 않을까?
// QUESTION : 새벽 5시 마다 리셋시키는 타이머는 어떻게 하지?.. CRON
// QUESTION : IDB를 사용하다가 회원가입을 하면 이때까지 작성해 둔 TODO는 날라가는 것일까?..
// TODO : 백엔드 코드를 참고해서 만들면서, 계산과 액션의 분리를 좀 더 꼼꼼히 해서 나중에 백엔드 코드에 다시 반영을 시킬 수 있도록 하자
// TODO : 비로그인 회원들의 focusTime을 쌓아둘 수 있을까?..-> 나중에 회원 가입 이후 로그인 했을 때 백엔드에,, 주간 vs 지난주 처럼 비교를 할 수 있도록 데이터를 쌓아둘 수 있을까?

// TODO : - 새벽 4시 -> 프론트 엔드에서 스윽 - 어쩌지..

import { ETIndexedDBAction } from './indexedAction';
import { ETIndexedDBCalc } from './indexedCalc';
import type { TodoEntity } from './indexedAction';
import { groupByDate } from '../shared/timeUtils';
import { TodoModuleType } from '../shared/todoModule';

/* 
removeTodos <- Cron 사용한 메소드임 -> 로그인이 안됐다? useEffect() 안에서 ETIndexedDBAction 이용해서 지금 DB 안에 있는 거 중에.. 어제꺼 Todo 쓰윽 지워버리던지..

로그인 비로그인 -> api를 사용하는 모든 지점에서 로그인 유무에 따라 코드를 2개씩 적어야 되는구나. -> 이걸 좀 .. 모듈화를 시킬 수 없을까..
-> if else -> 이 부분만이라도, 그냥 하나로 고차함수로 묶어두는 건 어떨까...

try - catch -> 이것도 모듈

TODO : 날짜를 바꾸면 order는 어떻게 하지?.. 그냥 그 날짜 마지막에 넣으면 될까? -> 이 부분은 기존 mySQL에서도 다루지 않았던 문제다.
+ 추가적으로 order를 변경할 때 같은 날짜 안에서 변경을 하면 그냥 order수정하는 메소드만 호출하면 될 거 같은데,
날짜를 넘겨서 order를 수정하는 부분이 있다면 update 메서드랑 다 불러야 할까?.. 정리를 제대로 해봐야 할 듯!
*/

type AddTodoDto = Omit<
  TodoEntity,
  'id' | 'createdAt' | 'focusTime' | 'done' | 'order'
>;

type UpdateTodoDto = Partial<
  Pick<TodoEntity, 'duration' | 'todo' | 'categories' | 'date'>
>;

class ETIndexed implements TodoModuleType {
  private static instance: ETIndexed;

  private constructor(
    private calc = new ETIndexedDBCalc(),
    private action = new ETIndexedDBAction(),
  ) {}

  public static getInstance(): ETIndexed {
    if (!ETIndexed.instance) {
      ETIndexed.instance = new ETIndexed();
      let checktInit = false;
      ETIndexed.instance.action.waitForInit().then((res) => (checktInit = res));

      if (!checktInit) new Error('DB didnt initialized');
    }

    return ETIndexed.instance;
  }

  async addTodo(todo: AddTodoDto) {
    if (Array.isArray(todo.categories) && todo.categories.length > 5) {
      return alert('카테고리는 5개 까지 추가할 수 있습니다.');
    }
    const getAllTodo = (await this.action.getAll()).filter(
      (todo) => todo.order !== null,
    );

    let newTodoOrder = 1;

    if (getAllTodo.length !== 0) {
      const getOrdered = this.calc.orderedList(getAllTodo);
      const reversedOrdered = [...getOrdered].reverse(); // findLast의 대체수단
      const searchDate = reversedOrdered.find(
        (el) => new Date(el.date) <= new Date(todo.date),
      );

      let plusedTodo: TodoEntity[];
      if (searchDate === undefined) {
        plusedTodo = this.calc.plusOrder(getOrdered) as TodoEntity[];
      } else {
        newTodoOrder = Number(searchDate.order) + 1;
        plusedTodo = this.calc.plusOrder(
          getOrdered.slice(Number(searchDate.order)),
        ) as TodoEntity[];
      }
      plusedTodo &&
        (await Promise.all(
          plusedTodo.map((todo) => this.action.updateOne(todo)),
        ));
    }

    const newTodo = {
      ...todo,
      order: newTodoOrder,
      done: false,
      focusTime: 0,
      createdAt: new Date(),
    };

    await this.action.add(newTodo);
  }

  async reorderTodos(prevOrder: number, newOrder: number) {
    const allTodoList = await this.action.getAll();
    const notNullTodos = allTodoList.filter((todo) => todo.order !== null);
    let bigNumber = 0,
      smallNumber = 0;

    if (prevOrder > newOrder) {
      bigNumber = prevOrder;
      smallNumber = newOrder;
    } else {
      bigNumber = newOrder;
      smallNumber = prevOrder;
    }

    const correspondingOrder = notNullTodos.filter(
      (todo) =>
        (todo.order as number) >= smallNumber &&
        (todo.order as number) <= bigNumber,
    );

    const modified = this.calc.updateOrder(
      correspondingOrder,
      prevOrder,
      newOrder,
    );

    await Promise.all(modified.map((todo) => this.action.updateOne(todo)));
  }

  async resetTodos() {
    await this.action.resetAll();
  }

  async getOneTodo(id: number) {
    const todo = await this.action.getOne(id);
    return todo;
  }

  async deleteTodo(id: number) {
    const getTodo = await this.action.getOne(id);
    const order = Number(getTodo.order);

    const getTodoList = await this.action.getAll();

    const orderedList = this.calc.orderedList(getTodoList);
    const expectedMinusPart = orderedList.slice(order);

    const doneMinus = this.calc.minusOrder(expectedMinusPart) as TodoEntity[];

    await this.action.removeOne(id);
    await Promise.all(doneMinus.map((todo) => this.action.updateOne(todo)));
  }

  async updateTodo(id: number, todo: UpdateTodoDto) {
    if (Array.isArray(todo.categories) && todo.categories.length > 5) {
      return alert('카테고리는 5개 까지 추가할 수 있습니다.');
    }
    const getTodo = await this.action.getOne(id);
    Object.assign(getTodo, todo);
    const updated = await this.action.updateOne(getTodo);
    return updated;
  }

  async doTodo(id: number, focusTime: string) {
    const getTodo = await this.action.getOne(id);
    const order = Number(getTodo.order);

    const getTodoList = await this.action.getAll();

    const orderedList = this.calc.orderedList(getTodoList);
    const expectedMinusPart = orderedList.slice(order);

    Object.assign(getTodo, { done: true, order: null, focusTime: focusTime });

    const doneMinus = this.calc.minusOrder(expectedMinusPart) as TodoEntity[];

    await Promise.all(doneMinus.map((todo) => this.action.updateOne(todo)));
    await this.action.updateOne(getTodo);
  }

  async getList(isDone: boolean) {
    await this.action.waitForInit();
    const getTodos = await this.action.getAll();
    if (getTodos.length === 0) return new Map();
    const doneTodo = getTodos.filter((todo) => todo.done === isDone);
    const orderedTodo = this.calc.orderedList(doneTodo);
    return groupByDate(orderedTodo);
  }

  /**
   * timeUtils에 있는 setTimeInFormat를 사용해서 해당 날짜 05:00:00를 기준으로 toISOString()메소드를 호출해야 한다.
   * cf) removeTodosBeforeToday(setTimeInFormat(new Date(), '05:00:00').toISOString())
   * @param {string} currentDate UTC형식의 시간입니다. toISOString 메소드를 사용한 결과
   *
   * @returns
   */
  async removeTodosBeforeToday(currentDate: string) {
    await this.action.waitForInit();
    const getTodos = await this.action.getAll();
    if (getTodos.length === 0) return;
    const stailTodos = getTodos.filter((todo) => todo.date <= currentDate);
    await Promise.all(
      stailTodos.map((todo) => this.action.removeOne(todo.todo)),
    );
  }
}

export { ETIndexed };
export type { AddTodoDto, UpdateTodoDto };
