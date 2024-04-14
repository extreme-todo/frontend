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
    const isPlus = prevOrder > newOrder;
    if (isPlus) {
      const calcTodos = this.plusOrder(todoList);
      const idx = calcTodos.findIndex((todo) => todo.order === prevOrder + 1);
      calcTodos[idx].order = newOrder;
      return calcTodos;
    } else {
      const calcTodos = this.minusOrder(todoList);
      const idx = calcTodos.findIndex((todo) => todo.order === prevOrder - 1);
      calcTodos[idx].order = newOrder;
      return calcTodos;
    }
  }

  doneTodo(todo: TodoEntity) {
    const copyTodo = Object.assign({}, todo);
    copyTodo.done = true;
    copyTodo.order = null;
    return copyTodo;
  }

  minusOrder(todos: TodoEntity[]) {
    return todos.map((todo) => {
      if (todo.order != null) {
        todo.order -= 1;
        return todo;
      } else return todo;
    });
  }

  plusOrder(todos: TodoEntity[]) {
    return todos.map((todo) => {
      (todo.order as number) += 1;
      return todo;
    });
  }
}

export { ETIndexedDBCalc };
