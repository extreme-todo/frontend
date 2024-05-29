import { TodoEntity } from './indexedAction';

class ETIndexedDBCalc {
  filterDone(isDone: boolean, todoList: TodoEntity[]): TodoEntity[] {
    return todoList.filter((todo) => todo.done === isDone);
  }

  orderedList(todoList: TodoEntity[]): TodoEntity[] {
    return todoList.sort((a, b) => (a.order as number) - (b.order as number));
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

  minusOrder(todos: TodoEntity[]) {
    if (todos.length === 0) return;
    return todos.map((todo) => {
      if (todo.order != null) {
        todo.order -= 1;
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
