import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { IChildProps } from '../shared/interfaces';

type EditTodoType = string | undefined;
type IEditContext = [
  EditTodoType,
  React.Dispatch<React.SetStateAction<EditTodoType>>,
];

const EditContext = createContext<IEditContext | null>(null);

const EditContextProvider = ({ children }: IChildProps): JSX.Element => {
  const editTodoId = useState<EditTodoType>(undefined);

  return (
    <EditContext.Provider value={editTodoId}>{children}</EditContext.Provider>
  );
};

const useEdit = () => {
  const value = useContext(EditContext);
  if (value === null)
    throw new Error('value is undefined', {
      cause: 'useEdit',
    });
  return value;
};

export { useEdit, EditContextProvider };
