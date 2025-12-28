import {
  useCurrentTodo,
  usePomodoroActions,
  usePomodoroValue,
} from '../../hooks';

export const CurrentTodoDevKit = () => {
  const pomodoroValue = usePomodoroValue();
  const pomodoroActions = usePomodoroActions();
  const currentTodo = useCurrentTodo({
    value: pomodoroValue,
    actions: pomodoroActions,
  });
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
      }}
    >
      <pre>{JSON.stringify(currentTodo, null, 2)}</pre>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <button
          className="devkit-button"
          onClick={() => {
            currentTodo.doTodo();
          }}
        >
          Do Todo
        </button>
        <button
          className="devkit-button"
          onClick={() => {
            currentTodo.updateFocus(1000);
          }}
        >
          Update Focus 1s
        </button>
      </div>
    </div>
  );
};
