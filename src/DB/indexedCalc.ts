import { TodoEntity } from './indexedAction';

class ETIndexedDBCalc {
  filterDone(isDone: boolean, todoList: TodoEntity[]): TodoEntity[] {
    return todoList.filter((todo) => todo.done === isDone);
  }

  orderedList(todoList: TodoEntity[]): TodoEntity[] {
    return todoList.sort((a, b) => (a.order as number) - (b.order as number));
  }

  /**
   * @param currentDate ISO 형식, 즉 2024-08-14T15:00:00.000Z 형태
   * 날짜의 2달 전 1일 날짜를 연.월.일 형식으로 계산해 준다.
   * @returns
   */
  getPast2Months(currentDate: string) {
    const today = new Date(currentDate);
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    const past2Month = String(
      (thisMonth - 2 < 0 ? thisMonth - 2 + 12 : thisMonth - 2) + 1,
    ).padStart(2, '0');
    const pastYear = thisMonth - 2 < 0 ? thisYear - 1 : thisYear;
    return `${pastYear}-${past2Month}-01`;
  }

  updateOrder(
    todoList: TodoEntity[],
    prevOrder: number,
    newOrder: number,
  ): TodoEntity[] {
    const isPlus = prevOrder > newOrder;
    let calcTodos: TodoEntity[];
    let idx: number;

    if (isPlus) {
      calcTodos = this.plusOrder(todoList) as TodoEntity[];
      idx = calcTodos.findIndex((todo) => todo.order === prevOrder + 1);
    } else {
      calcTodos = this.minusOrder(todoList) as TodoEntity[];
      idx = calcTodos.findIndex((todo) => todo.order === prevOrder - 1);
    }

    calcTodos[idx].order = newOrder;
    return calcTodos;
  }

  doneTodo(todo: TodoEntity) {
    const copyTodo = Object.assign({}, todo);
    copyTodo.done = true;
    copyTodo.order = null;
    return copyTodo;
  }

  minusOrder(todos: TodoEntity[], operand: number = 1) {
    if (todos.length === 0) return [];
    return todos.map((todo) => {
      if (todo.order != null) {
        todo.order -= operand;
        return todo;
      } else return todo;
    });
  }

  plusOrder(todos: TodoEntity[]) {
    if (todos.length === 0) return;
    return todos.map((todo) => {
      (todo.order as number) += 1;
      return todo;
    });
  }
}

export { ETIndexedDBCalc };
