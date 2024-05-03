import { ETIndexedDBCalc } from '../../DB/indexedCalc';
import { mockFetchTodoList } from '../../../fixture/mockTodoList';

describe('ExtremeTodoIndexedDB', () => {
  let mockTodoList: ReturnType<typeof mockFetchTodoList>;
  let indexedCalc: ETIndexedDBCalc;

  beforeEach(() => {
    mockTodoList = mockFetchTodoList();
    indexedCalc = new ETIndexedDBCalc();
  });

  describe('filterDone', () => {
    it('Done이 true인 한 개의 todo만 반환된다.', () => {
      const filtered = indexedCalc.filterDone(true, mockTodoList);
      expect(filtered.length).toBe(1);
    });
  });

  describe('orderedList', () => {
    it('order의 오름차순에 따라 리스트를 정렬한다.', () => {
      const filtered = indexedCalc.filterDone(false, mockTodoList);
      const ordered = indexedCalc.orderedList(filtered);
      expect(ordered[0].order).toBe(1);
    });
  });

  describe('groupByDate', () => {
    it('date를 기준으로 todo를 묶는다.', () => {
      const grouped = indexedCalc.groupByDate(mockTodoList);
      expect(grouped instanceof Map).toBe(true);
      expect(grouped.size).toBe(4);
    });
  });

  describe('updateOrder', () => {
    let correspondingOrder: typeof mockTodoList;

    beforeEach(() => {
      const notNullTodos = mockTodoList.filter((todo) => todo.order !== null);
      correspondingOrder = notNullTodos.filter(
        (todo) => (todo.order as number) >= 2 && (todo.order as number) <= 6,
      );
    });

    it('새로운 order값을 해당 todo의 order를 수정하고', () => {
      let targetTodo = correspondingOrder.filter((todo) => todo.order === 6);
      expect(targetTodo[0].id === 5).toBe(true);

      indexedCalc.updateOrder(correspondingOrder, 6, 2);

      targetTodo = correspondingOrder.filter((todo) => todo.order === 6);
      expect(targetTodo[0].id === 5).toBe(false);

      targetTodo = correspondingOrder.filter((todo) => todo.order === 2);
      expect(targetTodo[0].id === 5).toBe(true);
    });

    it('해당 범위 안에 있는 todo의 order를 수정한다.', () => {
      let targetTodo = correspondingOrder.filter((todo) => todo.order === 2);
      expect(targetTodo[0].id === 4).toBe(true);

      indexedCalc.updateOrder(correspondingOrder, 6, 2);

      targetTodo = correspondingOrder.filter((todo) => todo.order === 2);
      expect(targetTodo[0].id === 4).toBe(false);

      targetTodo = correspondingOrder.filter((todo) => todo.order === 3);
      expect(targetTodo[0].id === 4).toBe(true);
    });
  });

  describe('doneTodo', () => {
    it('해당 id의 done을 true로 하고 order을 null로 변경한다.', () => {
      const targetTodo = mockTodoList.filter((todo) => todo.id === 1);
      const done = indexedCalc.doneTodo(targetTodo[0]);
      expect(done.done).toBe(true);
      expect(done.order).toBe(null);
    });
  });

  describe('minusOrder', () => {
    it('주어진 todolist 안에 있는 todo의 order를 -1씩 한다.', () => {
      const targetTodo = mockTodoList.filter((todo) => todo.id !== null);
      expect(targetTodo[0].order).toBe(3);
      indexedCalc.minusOrder(targetTodo);
      expect(targetTodo[0].order).toBe(2);
    });
  });

  describe('plusOrder', () => {
    it('주어진 todoList 안에 있는 todo의 order를 +1씩 한다.', () => {
      const targetTodo = mockTodoList.filter((todo) => todo.id !== null);
      expect(targetTodo[0].order).toBe(3);
      indexedCalc.plusOrder(targetTodo);
      expect(targetTodo[0].order).toBe(4);
    });
  });
});
