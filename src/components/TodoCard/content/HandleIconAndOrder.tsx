import { memo } from 'react';
import { IconAtom, TypoAtom } from '../../../atoms';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface IHandleIconAndOrderProps {
  isCurrTodo: boolean;
  isThisEdit: boolean;
  done: boolean;
  order: number;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

const HandlerIconAndOrder = memo(
  ({
    isCurrTodo,
    isThisEdit,
    done,
    order,
    dragHandleProps,
  }: IHandleIconAndOrderProps) => {
    if (done) return null;
    else if (isCurrTodo) {
      return (
        <>
          <IconAtom
            src="icon/handle.svg"
            alt="handler"
            size={1.25}
            className="handler"
          />
          <TypoAtom fontSize="h3" fontColor="primary2">
            {order}.
          </TypoAtom>
        </>
      );
    } else {
      return (
        <>
          <div {...dragHandleProps}>
            <IconAtom
              src={
                isThisEdit ? 'icon/edit_handle.svg' : 'icon/yellowHandle.svg'
              }
              alt="handler"
              size={1.25}
            />
          </div>
          <TypoAtom
            fontSize="h3"
            fontColor={isThisEdit ? 'primary1' : 'primary2'}
          >
            {order}.
          </TypoAtom>
        </>
      );
    }
  },
);

export default HandlerIconAndOrder;
