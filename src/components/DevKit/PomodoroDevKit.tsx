import { usePomodoroActions, usePomodoroValue } from '../../hooks';
import { PomodoroService } from '../../services/PomodoroService';

export const PomodoroDevKit = () => {
  const pomodoroValue = usePomodoroValue();
  const pomodoroActions = usePomodoroActions();
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
      }}
    >
      <pre>{JSON.stringify(pomodoroValue, null, 2)}</pre>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {Object.entries(pomodoroActions)
          .filter(([key]) => key !== 'setFocusStep' && key !== 'setRestStep')
          .map(([key, action]) => (
            <button
              key={key}
              className="devkit-button"
              onClick={() => {
                (action as () => void)();
              }}
            >
              {key}
            </button>
          ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            className="devkit-button"
            onClick={() => {
              PomodoroService.setPomodoroSpeed(
                PomodoroService.getPomodoroSpeed() <= 1
                  ? PomodoroService.getPomodoroSpeed() === 1
                    ? 0.5
                    : Math.pow(PomodoroService.getPomodoroSpeed(), 2)
                  : PomodoroService.getPomodoroSpeed() - 1,
              );
            }}
          >
            -
          </button>
          Speed x{PomodoroService.getPomodoroSpeed()}
          <button
            className="devkit-button"
            onClick={() => {
              PomodoroService.setPomodoroSpeed(
                PomodoroService.getPomodoroSpeed() < 1
                  ? PomodoroService.getPomodoroSpeed() < 0.5
                    ? Math.sqrt(PomodoroService.getPomodoroSpeed())
                    : 1
                  : PomodoroService.getPomodoroSpeed() + 1,
              );
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
