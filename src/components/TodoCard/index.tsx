import { focusStep, useTodoUpdate } from '../../hooks';
import { TodoEntity } from '../../DB/indexedAction';
import { RandomTagColorList } from '../../shared/RandomTagColorList';

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

export const TodoCard = ({
  todoData,
  focusStep,
  randomTagColor,
  isCurrTodo,
  order,
  isThisEdit,
  setEditTodoId,
  isExtreme,
  isFirst,
  isLast,
}: ITodoCardProps) => {
  const {
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
  } = useTodoUpdate({ todoData, setEditTodoId, isThisEdit });

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
        focusStepValue={focusStep}
        handleTomato={handleTomato}
        isSubmitting={isLoading}
        isDisabled={titleValue.length === 0 || titleError || isLoading}
        handleEditSubmit={handleEditSubmit}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
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
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};
