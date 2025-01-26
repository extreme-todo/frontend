import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { IChildProps } from '../shared/interfaces';

interface IEdit {
  editMode: boolean;
  editTodoId: string | undefined;
}
type editContextType = [IEdit, (newEditState: IEdit) => void];
const defaultUseEdit: editContextType = [
  { editMode: false, editTodoId: undefined },
  (newEditState: IEdit) => {
    return;
  },
];

const EditContext = createContext<editContextType>(defaultUseEdit);

const EditContextProvider = ({ children }: IChildProps): JSX.Element => {
  const [edit, setEdit] = useState<IEdit>({
    editMode: false,
    editTodoId: undefined,
  });

  const handleState = useCallback((newEditState: IEdit) => {
    setEdit(newEditState);
  }, []);

  const wrapState: editContextType = useMemo(
    () => [edit, handleState],
    [edit, handleState],
  );

  return (
    <EditContext.Provider value={wrapState}>{children}</EditContext.Provider>
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

export { useEdit, EditContextProvider, type IEdit, type editContextType };
