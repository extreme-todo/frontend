import { ReactElement, useRef } from 'react';
import { DraggableProvided, DraggingStyle } from 'react-beautiful-dnd';
import { createPortal } from 'react-dom';

const useDraggableInPortal = () => {
  const element = useRef<HTMLDivElement>(
    document.getElementById('draggable') as HTMLDivElement,
  ).current;

  return (render: (provided: DraggableProvided) => ReactElement) =>
    (provided: DraggableProvided) => {
      const result = render(provided);
      const style = provided.draggableProps.style as DraggingStyle;
      if (style.position === 'fixed') {
        return createPortal(result, element);
      }
      return result;
    };
};

export default useDraggableInPortal;
