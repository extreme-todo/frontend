import React, { createContext, useContext, useState } from 'react';
import { IChildProps } from '../shared/interfaces';

type EditTodoType = string | undefined;
type IEditContext = [
  EditTodoType,
  React.Dispatch<React.SetStateAction<EditTodoType>>,
];

const EditContext = createContext<IEditContext>([undefined, () => undefined]);

const EditContextProvider = ({ children }: IChildProps): JSX.Element => {
  const editTodoId = useState<EditTodoType>(undefined);

  return (
    <EditContext.Provider value={editTodoId}>{children}</EditContext.Provider>
  );
};

const useEdit = () => {
  const value = useContext(EditContext);
  return value;
};

export { useEdit, EditContextProvider };
