import { TodoEntity } from './indexedAction';

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

  updateOrder(
    todoList: TodoEntity[],
    prevOrder: number,
    newOrder: number,
  ): TodoEntity[] {
    return todoList.map((todo) => {
      if (todo.order === Number(prevOrder)) {
        todo.order = Number(newOrder);
      } else {
        const isShiftUp = prevOrder > newOrder;
        const shiftAmount = isShiftUp ? 1 : -1;
        (todo.order as number) += shiftAmount;
      }
      return todo;
    });
  }

  doneTodo(todo: TodoEntity) {
    const copyTodo = Object.assign({}, todo);
    copyTodo.done = true;
    copyTodo.order = null;
    return copyTodo;
  }

  minusOne(todos: TodoEntity[]) {
    return todos.map((todo) => {
      (todo.order as number) -= 1;
      return todo;
    });
  }

  plusOne(todos: TodoEntity[]) {
    return todos.map((todo) => {
      (todo.order as number) += 1;
      return todo;
    });
  }
}

export { ETIndexedDBCalc };
