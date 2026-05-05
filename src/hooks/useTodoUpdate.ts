import {
  FormEvent,
  ReactEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ZodError } from 'zod';
import {
  MAX_CATEGORY_ARRAY_LENGTH,
  MAX_TITLE_INPUT_LENGTH_WARNING,
  TITLE_EMPTY_MESSAGE,
  TodoEntity,
} from '../DB/indexedAction';
import { UpdateDto, UpdateSchema } from '../DB/indexed';
import { titleValidation, categoryValidation } from '../shared/inputValidation';
import { RandomTagColorList } from '../shared/RandomTagColorList';
import { useTodoMutation } from './useTodoMutation';

interface UseTodoUpdateProps {
  todoData: TodoEntity;
  setEditTodoId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isThisEdit: boolean;
}

const ramdomTagColorList = RandomTagColorList.getInstance();

export const useTodoUpdate = ({
  todoData,
  setEditTodoId,
  isThisEdit,
}: UseTodoUpdateProps) => {
  const { id, date: prevDate, todo, categories, duration } = todoData;

  // =========================================================================
  // 1. Mutation 및 API 관련 로직 (useTodoMutation)
  // =========================================================================
  const { updateMutate, deleteMutate, moveReorderHandler, isLoading } =
    useTodoMutation({ todoData, setEditTodoId });

  // =========================================================================
  // 2. UI 및 입력 데이터 상태 관리 (Local State)
  // =========================================================================
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

  // =========================================================================
  // 3. UI 핸들러 로직 (UI & Input Handlers)
  // =========================================================================
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

  const handleMoveUp = useCallback(
    () => moveReorderHandler('up'),
    [moveReorderHandler],
  );

  const handleMoveDown = useCallback(
    () => moveReorderHandler('down'),
    [moveReorderHandler],
  );

  // =========================================================================
  // 4. 부수 효과 (Effects)
  // =========================================================================
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
