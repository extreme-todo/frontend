import { TodoResponseDto } from '../hooks/useCurrentTodo';
import { TodoEntity } from '../DB/indexedAction';

// const NowCard = ({ currentTodo }: { currentTodo: TodoEntity }) => {
const NowCard = ({
  currentTodo,
}: {
  currentTodo: TodoResponseDto | undefined; // TODO : undefiend 일 때 fallbackUI를 보여줄까?..
}) => {
  return (
    <>
      <div aria-label="current_todo_title">{currentTodo.todo}</div>;
      <div aria-label="current_todo_duration">{currentTodo.duration}</div>;
      {currentTodo.categories?.map((category) => (
        <div key={category} aria-label="current_todo_categories">
          {category}
        </div>
      ))}
    </>
  );
};

export default NowCard;
