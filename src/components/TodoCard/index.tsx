import { FormEvent, ReactEventHandler, useCallback, useState } from 'react';

import { focusStep } from '../../hooks';
import { todosApi } from '../../shared/apis';
import {
  MAX_CATEGORY_ARRAY_LENGTH,
  MAX_TITLE_INPUT_LENGTH_WARNING,
  TITLE_EMPTY_MESSAGE,
  TodoEntity,
} from '../../DB/indexedAction';
import { UpdateDto, UpdateSchema } from '../../DB/indexed';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  categoryValidation,
  titleValidation,
} from '../../shared/inputValidation';
import { RandomTagColorList } from '../../shared/RandomTagColorList';

import { ZodError } from 'zod';
import { TodoUI } from './TodoUI';
import { EditUI } from './EditUI';

interface ITodoCardProps {
  todoData: TodoEntity;
  focusStep: focusStep;
  randomTagColor: RandomTagColorList;
  isExtreme: boolean;
  isCurrTodo: boolean;
  order: number;
  isThisEdit: boolean;
  setEditTodoId: React.Dispatch<React.SetStateAction<string | undefined>>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const ramdomTagColorList = RandomTagColorList.getInstance();

export const TodoCard = ({
  todoData,
  focusStep,
  randomTagColor,
  isCurrTodo,
  order,
  isThisEdit,
  setEditTodoId,
  isExtreme,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ITodoCardProps) => {
  const { id, date: prevDate, todo, categories, duration } = todoData;

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

  // apis
  const queryClient = useQueryClient();

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
        const searchDate = arrayTodos
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

  const { mutate: updateMutate, isLoading } = useMutation({
    mutationFn: updateMutationHandler,
    onMutate: async ({ newTodo, id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<
        Map<string, TodoEntity[]> | undefined
      >(['todos']);

      queryClient.setQueryData<Map<string, TodoEntity[]> | undefined>(
        ['todos'],
        (oldData) => {
          if (!oldData) return oldData;
          const todoMap = new Map(oldData);
          Array.from(todoMap.entries()).forEach(([date, todos]) => {
            const updatedTodos = todos.map((todo: TodoEntity) =>
              todo.id === id ? { ...todo, ...newTodo } : todo,
            );
            todoMap.set(date, updatedTodos);
          });
          return todoMap;
        },
      );

      return previousTodos;
    },
    onSuccess() {
      setEditTodoId(undefined);
    },
    onError(error, _, context) {
      console.debug('\n\n\n 🚨 error in TodoCard updateTodos 🚨 \n\n', error);
      queryClient.setQueryData(['todos'], context);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ id }: { id: string }) => todosApi.deleteTodo(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<
        Map<string, TodoEntity[]> | undefined
      >(['todos']);
      queryClient.setQueryData<Map<string, TodoEntity[]> | undefined>(
        ['todos'],
        (oldData) => {
          if (!oldData) return oldData;
          const todoMap = new Map(oldData);
          Array.from(todoMap.entries()).forEach(([date, todos]) => {
            const updatedTodos = todos.filter(
              (todo: TodoEntity) => todo.id !== id,
            );
            todoMap.set(date, updatedTodos);
          });
          return todoMap;
        },
      );

      return previousTodos;
    },
    onError(error, _, context) {
      console.debug('\n\n\n 🚨 error in TodoCard deleteTodo 🚨 \n\n', error);
      queryClient.setQueryData(['todos'], context);
    },
  });

  // handlers
  const handleEditButton = useCallback(() => {
    setEditTodoId(id);
  }, [id, setEditTodoId]);

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
      } else {
        if (error instanceof ZodError) {
          alert(error.issues[0].message);
        }
      }
    },
    [id, prevDate, categoryArray, durationValue, updateMutate, todoData.date],
  );

  const handleChangeTitle: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const trimmed = titleValidation(event.currentTarget.value);
      if (typeof trimmed === 'object') {
        if (!titleError) {
          setTitleError(true);
        }
        if (trimmed.errorMessage === MAX_TITLE_INPUT_LENGTH_WARNING) {
          return;
        }
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

  const handleDeleteButton = useCallback(() => {
    deleteMutate({ id });
  }, [id, deleteMutate]);

  const handleAddCategory = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        event.preventDefault();
        if (event.currentTarget.value.length === 0) return;
        if (event.nativeEvent.isComposing) return;

        const newCategory = (event.target as HTMLInputElement).value;

        const trimmed = categoryValidation(newCategory);

        if (typeof trimmed === 'object') return;
        else if (
          typeof trimmed === 'string' &&
          !categoryArray.includes(trimmed) &&
          categoryArray.length <= MAX_CATEGORY_ARRAY_LENGTH
        ) {
          const copy = categoryArray.slice();
          copy.push(trimmed);
          setCategoryArray(copy);
          ramdomTagColorList.setColor = trimmed;
        }

        setCategoryValue('');
      }
    },
    [categoryArray],
  );

  const handleDeleteCategory = useCallback((category: string) => {
    setCategoryArray((prev) => {
      const deleted = prev?.filter((tag) => {
        return tag !== category;
      });

      return deleted;
    });
  }, []);

  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryValue(event.target.value);
      if (event.currentTarget.value.length === 0) {
        return categoryError !== undefined && setCategoryError(undefined);
      }
      const trimmed = categoryValidation(event.currentTarget.value);
      if (typeof trimmed === 'object' && trimmed.errorMessage !== categoryError)
        setCategoryError(trimmed.errorMessage);
      else if (typeof trimmed === 'string' && categoryError !== undefined) {
        setCategoryError(undefined);
      }
    },
    [categoryError],
  );

  const handleTomato = useCallback(
    (count: number) => setDurationValue(count),
    [],
  );

  if (isThisEdit) {
    return (
      <EditUI
        titleValue={titleValue}
        handleChangeTitle={handleChangeTitle}
        handleTitleBlur={handleTitleBlur}
        titleError={titleError}
        order={order}
        handleEditCancel={handleEditCancel}
        categoryArray={categoryArray}
        handleAddCategory={handleAddCategory}
        handleDeleteCategory={handleDeleteCategory}
        categoryValue={categoryValue}
        handleChangeCategory={handleChangeCategory}
        tagColorList={randomTagColor.getColorList}
        categoryError={categoryError}
        durationValue={durationValue}
        focusStep={focusStep}
        handleTomato={handleTomato}
        isSubmitting={isLoading}
        isDisabled={titleValue.length === 0 || titleError || isLoading}
        handleEditSubmit={handleEditSubmit}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
        isCurrTodo={isCurrTodo}
        isExtreme={isExtreme}
      />
    );
  }

  return (
    <TodoUI
      todoData={todoData}
      focusStep={focusStep}
      randomTagColor={randomTagColor}
      isExtreme={isExtreme}
      isCurrTodo={isCurrTodo}
      order={order}
      handleEditButton={handleEditButton}
      handleDeleteButton={handleDeleteButton}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};
