import { useContext } from 'react';
import { EditContext } from '../components/TodoList';

const useEdit = () => {
  const value = useContext(EditContext);
  if (value === undefined)
    throw new Error('value is undefined', {
      cause: 'useEdit',
    });
  return value;
};

export default useEdit;
