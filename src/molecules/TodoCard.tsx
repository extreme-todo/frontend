import { ReactElement, useState } from 'react';
import { IconAtom, TagAtom, TypoAtom } from '../atoms';
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { TodoEntity } from '../DB/indexedAction';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';

interface ITodoCardProps {
  todoData: TodoEntity;
}

const optionalPortal = (
  style: DraggingStyle | NotDraggingStyle | undefined,
  element: ReactElement,
) => {
  if (
    Object.getOwnPropertyNames(style).includes('position') &&
    (style as DraggingStyle).position === 'fixed'
  ) {
    return createPortal(element, document.body);
  }
  return element;
};

const TodoCard = ({ todoData }: ITodoCardProps) => {
  const {
    id,
    date,
    todo,
    createdAt,
    duration,
    done,
    categories,
    focusTime,
    order,
  } = todoData;

  const [showEdit, setShowEdit] = useState(false);
  const onMouseOverHandler = () => {
    setShowEdit(true);
  };
  const onMouseOutHandler = () => {
    setShowEdit(false);
  };

  return (
    <>
      <Draggable draggableId={String(id)} index={id}>
        {(provided) =>
          optionalPortal(
            provided.draggableProps.style,
            <TodoCardContainer
              onMouseOver={onMouseOverHandler}
              onMouseOut={onMouseOutHandler}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <IconAtom {...provided.dragHandleProps} size={2}>
                <img src={'icons/handle.svg'}></img>
              </IconAtom>
              <div>
                <TypoAtom>{todo}</TypoAtom>
                <TodoCategoryContainer>
                  {categories?.map((category) => {
                    return (
                      <TagAtom
                        key={category}
                        styleOption={{
                          fontsize: 'sm',
                          size: 'sm',
                          bg: 'lightGrey_2',
                        }}
                      >
                        {category}
                      </TagAtom>
                    );
                  })}
                </TodoCategoryContainer>
              </div>
              {showEdit ? (
                <TagAtom styleOption={{ fontsize: 'sm', size: 'sm' }}>
                  수정
                </TagAtom>
              ) : null}
            </TodoCardContainer>,
          )
        }
      </Draggable>
    </>
  );
};

export default TodoCard;

const TodoCardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 0.3rem;
`;
const TodoCategoryContainer = styled.div`
  display: flex;
`;
