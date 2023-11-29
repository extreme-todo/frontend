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

  const [titleValue, setTitleValue] = useState(todo);
  const [categoryValue, setCategoryValue] = useState('');
  const [addCategory, setAddCategory] = useState(false);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(event.target.value);
  };

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryValue(event.target.value);
  };

  const handleAddCategory = () => {
    setAddCategory(true);
  };

  return (
    <div>
      <input
        value={titleValue}
        onChange={handleChangeTitle}
        aria-label="title"
      />
      {categories?.map((category) => (
        <div key={category}>{category}</div>
      ))}
      {addCategory ? (
        <input
          aria-label="category"
          value={categoryValue}
          onChange={handleChangeCategory}
        />
      ) : (
        <button onClick={handleAddCategory}>카테고리를 입력하세요</button>
      )}
    </div>
  );
};

export default EditUI;
