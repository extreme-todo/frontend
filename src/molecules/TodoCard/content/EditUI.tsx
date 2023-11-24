import { useState } from 'react';
import { TodoEntity } from '../../../DB/indexedAction';

const EditUI = ({ todoData }: { todoData: TodoEntity }) => {
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

  const [value, setValue] = useState(todo);

  const handleChange = (str: string) => {
    setValue(str);
  };

  return (
    <div>
      <input value={value} onChange={() => handleChange} />
      {categories?.map((category) => (
        <div key={category}>{category}</div>
      ))}
    </div>
  );
};

export default EditUI;
