import {
  FormEvent,
  ReactEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ZodError } from 'zod';
import { todosApi } from '../shared/apis';
import {
  MAX_CATEGORY_ARRAY_LENGTH,
  MAX_TITLE_INPUT_LENGTH_WARNING,
  TITLE_EMPTY_MESSAGE,
  TodoEntity,
} from '../DB/indexedAction';
import { UpdateDto, UpdateSchema } from '../DB/indexed';
import { titleValidation, categoryValidation } from '../shared/inputValidation';
import { RandomTagColorList } from '../shared/RandomTagColorList';

interface UseTodoUpdateProps {
  todoData: TodoEntity;
  setEditTodoId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isThisEdit: boolean;
}

interface MutationContext {
  previousTodos: Map<string, TodoEntity[]> | undefined;
}

const ramdomTagColorList = RandomTagColorList.getInstance();

export const useTodoUpdate = ({
  todoData,
  setEditTodoId,
  isThisEdit,
}: UseTodoUpdateProps) => {
  const { id, date: prevDate, todo, categories, duration } = todoData;
  const queryClient = useQueryClient();

  /* --- 1. UI 및 입력 데이터 상태 관리 --- */
  const [titleValue, setTitleValue] = useState(todo);
  const [titleError, setTitleError] = useState(false);
  const [categoryArray, setCategoryArray] = useState<string[]>(
    categories ?? [],
  );
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryError, setCategoryError] = useState<string | undefined>(
    undefined,
  );
  const [durationValue, setDurationValue] = useState(duration);

  /**
   * 낙관적 업데이트를 위한 캐시 업데이트 헬퍼
   */
  const updateTodoCache = useCallback(
    (
      updateFn: (
        oldData: Map<string, TodoEntity[]>,
      ) => Map<string, TodoEntity[]>,
    ) => {
      queryClient.setQueryData<Map<string, TodoEntity[]> | undefined>(
        ['todos'],
        (oldData) => {
          if (!oldData) return oldData;
          return updateFn(new Map(oldData));
        },
      );
    },
    [queryClient],
  );

  /* --- 2. Mutation: 순서 변경 (Reorder) --- */
  const { mutate: reorderMutate } = useMutation<
    void,
    unknown,
    {
      prevOrder: number;
      newOrder: number;
      todolist?: Map<string, TodoEntity[]>;
    },
    MutationContext
  >(({ prevOrder, newOrder }) => todosApi.reorderTodos(prevOrder, newOrder), {
    onMutate: async ({ todolist }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Map<string, TodoEntity[]>>(
        ['todos'],
      );
      if (todolist) {
        queryClient.setQueryData(['todos'], todolist);
      }
      return { previousTodos };
    },
    onError: (error, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
  });

  /* --- 3. Mutation: 수정 (Update) --- */
  const updateMutationHandler = useCallback(
    async ({
      newTodo,
      id,
      prevDate,
    }: {
      newTodo: UpdateDto;
      id: string;
      prevDate: string;
    }) => {
      if (newTodo.date === prevDate) {
        await todosApi.updateTodo(id, newTodo);
      } else {
        const mapTodos = queryClient.getQueryData(['todos']) as Map<
          string,
          TodoEntity[]
        >;
        const arrayTodos = Array.from(mapTodos.values()).flat();
        const { order: prevOrder } = arrayTodos.find(
          (todo) => todo.id === id,
        ) as TodoEntity;
        const searchDate = [...arrayTodos]
          .reverse()
          .find((todo) => todo.date <= newTodo.date) as TodoEntity;

        let newOrder: number;
        if (!searchDate) {
          newOrder = 1;
        } else if ((prevOrder as number) > (searchDate.order as number)) {
          newOrder = (searchDate.order as number) + 1;
        } else {
          newOrder = searchDate.order as number;
        }

        await todosApi.updateTodo(id, newTodo);
        if (prevOrder !== newOrder) {
          await todosApi.reorderTodos(prevOrder as number, newOrder);
        }
      }
    },
    [queryClient],
  );

  const { mutate: updateMutate, isLoading } = useMutation<
    void,
    unknown,
    { newTodo: UpdateDto; id: string; prevDate: string },
    MutationContext
  >({
    mutationFn: updateMutationHandler,
    onMutate: async ({ newTodo, id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Map<string, TodoEntity[]>>(
        ['todos'],
      );

      updateTodoCache((todoMap) => {
        Array.from(todoMap.entries()).forEach(([date, todos]) => {
          const updatedTodos = todos.map((todo: TodoEntity) =>
            todo.id === id ? { ...todo, ...newTodo } : todo,
          );
          todoMap.set(date, updatedTodos);
        });
        return todoMap;
      });

      return { previousTodos };
    },
    onSuccess: () => setEditTodoId(undefined),
    onError: (error, _, context) => {
      if (context?.previousTodos)
        queryClient.setQueryData(['todos'], context.previousTodos);
    },
  });

  /* --- 4. Mutation: 삭제 (Delete) --- */
  const { mutate: deleteMutate } = useMutation<
    void,
    unknown,
    { id: string },
    MutationContext
  >({
    mutationFn: ({ id }: { id: string }) => todosApi.deleteTodo(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Map<string, TodoEntity[]>>(
        ['todos'],
      );

      updateTodoCache((todoMap) => {
        Array.from(todoMap.entries()).forEach(([date, todos]) => {
          const updatedTodos = todos.filter(
            (todo: TodoEntity) => todo.id !== id,
          );
          todoMap.set(date, updatedTodos);
        });
        return todoMap;
      });

      return { previousTodos };
    },
    onError: (error, _, context) => {
      if (context?.previousTodos)
        queryClient.setQueryData(['todos'], context.previousTodos);
    },
  });

  /* --- 5. 순서 조정 핸들러 (Up/Down) --- */
  const moveReorderHandler = useCallback(
    (direction: 'up' | 'down') => {
      const todos = queryClient.getQueryData<Map<string, TodoEntity[]>>([
        'todos',
      ]);
      if (!todos) return;

      const copyMapTodo = new Map(todos);
      const dateKey = Array.from(copyMapTodo.keys())[0];
      const copyTodo = (copyMapTodo.get(dateKey) ?? []).slice();
      const idx = copyTodo.findIndex((t) => t.id === id);
      if (idx === -1) return;

      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= copyTodo.length) return;

      const prevOrder = todoData.order as number;
      const newOrder = copyTodo[swapIdx].order as number;

      [copyTodo[idx], copyTodo[swapIdx]] = [copyTodo[swapIdx], copyTodo[idx]];
      copyMapTodo.set(dateKey, copyTodo);

      reorderMutate({ prevOrder, newOrder, todolist: copyMapTodo });
    },
    [id, todoData.order, queryClient, reorderMutate],
  );

  const handleMoveUp = useCallback(
    () => moveReorderHandler('up'),
    [moveReorderHandler],
  );
  const handleMoveDown = useCallback(
    () => moveReorderHandler('down'),
    [moveReorderHandler],
  );

  /* --- 6. 사용자 입력 핸들러 --- */
  const handleEditButton = useCallback(
    () => setEditTodoId(id),
    [id, setEditTodoId],
  );

  const handleEditSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const newTodo: UpdateDto = {
        date: todoData.date,
        todo: formData.get('title') as string,
        duration: durationValue,
        categories: categoryArray.length === 0 ? null : categoryArray,
      };
      const { success, error } = UpdateSchema.safeParse(newTodo);
      if (success) {
        updateMutate({ newTodo, id, prevDate });
      } else if (error instanceof ZodError) {
        alert(error.issues[0].message);
      }
    },
    [id, prevDate, categoryArray, durationValue, updateMutate, todoData.date],
  );

  const handleChangeTitle: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const trimmed = titleValidation(event.currentTarget.value);
      if (typeof trimmed === 'object') {
        if (!titleError) setTitleError(true);
        if (trimmed.errorMessage === MAX_TITLE_INPUT_LENGTH_WARNING) return;
      } else if (typeof trimmed === 'string' && titleError !== undefined) {
        setTitleError(false);
      }
      setTitleValue(event.currentTarget.value);
    },
    [titleError],
  );

  const handleTitleBlur: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const checkEmpty = titleValidation(event.currentTarget.value);
      if (
        typeof checkEmpty === 'object' &&
        checkEmpty.errorMessage === TITLE_EMPTY_MESSAGE
      ) {
        setTitleError(true);
      }
    },
    [],
  );

  const handleEditCancel = useCallback(() => {
    setEditTodoId(undefined);
    setTitleValue(todo);
    setCategoryArray(categories ?? []);
    setDurationValue(duration);
    setCategoryValue('');
    setTitleError(false);
    setCategoryError(undefined);
  }, [todo, categories, duration, setEditTodoId]);

  const handleDeleteButton = useCallback(
    () => deleteMutate({ id }),
    [id, deleteMutate],
  );

  const handleAddCategory = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        event.preventDefault();
        if (
          event.currentTarget.value.length === 0 ||
          event.nativeEvent.isComposing
        )
          return;
        const newCategory = (event.target as HTMLInputElement).value;
        const trimmed = categoryValidation(newCategory);
        if (typeof trimmed === 'object') return;
        if (
          typeof trimmed === 'string' &&
          !categoryArray.includes(trimmed) &&
          categoryArray.length <= MAX_CATEGORY_ARRAY_LENGTH
        ) {
          const copy = [...categoryArray, trimmed];
          setCategoryArray(copy);
          ramdomTagColorList.setColor = trimmed;
        }
        setCategoryValue('');
      }
    },
    [categoryArray],
  );

  const handleDeleteCategory = useCallback((category: string) => {
    setCategoryArray((prev) => prev?.filter((tag) => tag !== category));
  }, []);

  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryValue(event.target.value);
      const trimmed = categoryValidation(event.currentTarget.value);
      if (event.currentTarget.value.length === 0) setCategoryError(undefined);
      else if (
        typeof trimmed === 'object' &&
        trimmed.errorMessage !== categoryError
      )
        setCategoryError(trimmed.errorMessage);
      else if (typeof trimmed === 'string') setCategoryError(undefined);
    },
    [categoryError],
  );

  const handleTomato = useCallback(
    (count: number) => setDurationValue(count),
    [],
  );

  /* --- 7. 부수 효과 --- */
  useEffect(() => {
    if (!isThisEdit) {
      // isThisEdit가 false가 되면 입력값 초기화 등 필요한 처리 수행 가능
    }
  }, [isThisEdit]);

  return {
    titleValue,
    titleError,
    categoryArray,
    categoryValue,
    categoryError,
    durationValue,
    isLoading,
    handleEditButton,
    handleEditSubmit,
    handleChangeTitle,
    handleTitleBlur,
    handleEditCancel,
    handleDeleteButton,
    handleAddCategory,
    handleDeleteCategory,
    handleChangeCategory,
    handleTomato,
    handleMoveUp,
    handleMoveDown,
  };
};
