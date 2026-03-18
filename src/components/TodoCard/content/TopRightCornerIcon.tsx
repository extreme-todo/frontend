import { memo } from 'react';
import { BtnAtom, IconAtom } from '../../../atoms';

export const TopRightCornerIcon = memo(
  ({
    isCurrTodo,
    done,
    isThisEdit,
    handleEditCancel,
    handleDeleteButton,
  }: {
    isCurrTodo: boolean;
    done: boolean;
    isThisEdit: boolean;
    handleEditCancel: () => void;
    handleDeleteButton: () => void;
  }) => {
    if (isCurrTodo || done) return null;
    else if (isThisEdit) {
      return (
        <BtnAtom handleOnClick={handleEditCancel}>
          <IconAtom src={'icon/closeDark.svg'} size={1.25} alt="cancel" />
        </BtnAtom>
      );
    } else {
      return (
        <BtnAtom handleOnClick={handleDeleteButton}>
          <IconAtom src={'icon/delete.svg'} size={1.25} alt="delete" />
        </BtnAtom>
      );
    }
  },
);
