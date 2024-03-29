import { ReactElement, useRef } from 'react';
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
} from 'react-beautiful-dnd';
import { createPortal } from 'react-dom';

const useDraggableInPortal = () => {
  const element = useRef<HTMLDivElement>(
    document.getElementById('draggable') as HTMLDivElement,
  ).current;

  return (
      render: (
        provided: DraggableProvided,
        snapshot: DraggableStateSnapshot,
      ) => ReactElement,
    ) =>
    (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
      const result = render(provided, snapshot);
      const style = provided.draggableProps.style as DraggingStyle;
      if (style.position === 'fixed') {
        return createPortal(result, element);
      }
      return result;
    };
};

export default useDraggableInPortal;
