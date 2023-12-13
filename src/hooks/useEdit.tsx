import React, { createContext, useContext, useState } from 'react';
import { IChildProps } from '../shared/interfaces';

interface IEdit {
  editMode: boolean;
  editTodoId: number | undefined;
}
type contextType = [IEdit, React.Dispatch<React.SetStateAction<IEdit>>];

interface IEditContextProps extends IChildProps {}

const EditContext = createContext<contextType | undefined>(undefined);

const EditContextProvider = ({ children }: IEditContextProps): JSX.Element => {
  const editState = useState<IEdit>({ editMode: false, editTodoId: undefined });
  return (
    <EditContext.Provider value={editState}>{children}</EditContext.Provider>
  );
};

const useEdit = () => {
  const value = useContext(EditContext);
  if (value === undefined)
    throw new Error('value is undefined', {
      cause: 'useEdit',
    });
  return value;
};

export { useEdit, EditContextProvider };
