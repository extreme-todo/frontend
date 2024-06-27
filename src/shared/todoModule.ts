import { AddTodoDto, ETIndexed, UpdateTodoDto } from '../DB/indexed';
import { TodoEntity } from '../DB/indexedAction';
import { todosApi } from './apis';

type ModuleType = typeof todosApi | ETIndexed;

export interface TodoModuleType {
  resetTodos(): Promise<void>;
  addTodo(todo: AddTodoDto): any;
  reorderTodos(prevOrder: number, newOrder: number): any;
  updateTodo(id: string, todo: UpdateTodoDto): any;
  getList(isDone: boolean): Promise<Map<string, TodoEntity[]>>;
  getOneTodo(id: string): Promise<TodoEntity>;
  deleteTodo(id: string): any;
  doTodo(id: string, focusTime: string): any;
  removeTodosBeforeToday(currentDate: string): any;
}

export class TodoModule implements TodoModuleType {
  private static instance: TodoModule;
  private api: ModuleType;

  private constructor(api: ModuleType) {
    this.api = api;
  }

  static getInstance(api: ModuleType): TodoModule {
    if (!this.instance) {
      TodoModule.instance = new TodoModule(api);
      return TodoModule.instance;
    }
    return TodoModule.instance;
  }

  resetTodos(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  addTodo(todo: AddTodoDto) {
    throw new Error('Method not implemented.');
  }
  reorderTodos(prevOrder: number, newOrder: number) {
    throw new Error('Method not implemented.');
  }
  updateTodo(
    id: string,
    todo: Partial<
      Pick<TodoEntity, 'date' | 'todo' | 'duration' | 'categories'>
    >,
  ): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }
  getList(isDone: boolean): Promise<Map<string, TodoEntity[]>> {
    throw new Error('Method not implemented.');
  }
  getOneTodo(id: string): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }
  deleteTodo(id: string) {
    throw new Error('Method not implemented.');
  }
  doTodo(id: string, focusTime: string) {
    throw new Error('Method not implemented.');
  }
  removeTodosBeforeToday() {
    throw new Error('Method not implemented.');
  }
}
