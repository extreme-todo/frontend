import styled from '@emotion/styled';
import { BtnAtom, CardAtom, TodoProgressBarAtom, TypoAtom } from '../atoms';
import { Clock, ExtremeModeIndicator } from '../molecules';
import { PomodoroStatus } from '../services/PomodoroService';
import { usePomodoroActions, usePomodoroValue } from '../hooks/usePomodoro';
import { useCurrentTodo, useExtremeMode } from '../hooks';

function RestCard() {
  const pomodoro = usePomodoroValue();
  const actions = usePomodoroActions();
  const { isExtreme } = useExtremeMode();
  const {
    canRest,
    currentTodo: todo,
    doTodo,
  } = useCurrentTodo({
    value: { ...pomodoro },
    actions,
  });
  const getLeftMs = () => {
    return pomodoro.settings.restStep * 60000 - (pomodoro.time ?? 0);
  };
  return (
    <CardAtom className="card" bg={'primary2'}>
      {pomodoro.status === PomodoroStatus.RESTING && (
        <RestCardWrapper>
          <ExtremeModeIndicator />
          <div className="center-container">
            <TypoAtom
              fontSize={'h3'}
              fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
              className="left-time"
            >
              남은 휴식시간
            </TypoAtom>
            <Clock
              ms={getLeftMs()}
              show={{
                hour: false,
                min: true,
                sec: true,
              }}
              fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
            ></Clock>
            <div className="button-container">
              <BtnAtom
                className="focus"
                btnType={isExtreme ? 'extremeLightBtn' : 'lightBtn'}
                handleOnClick={() => {
                  canRest ? doTodo() : actions.startFocusing();
                }}
              >
                {canRest ? '다음 할 일 하기' : '끝내기'}
              </BtnAtom>
              {canRest && (
                <BtnAtom
                  className="focusMore"
                  handleOnClick={() => actions.startOverFocusing()}
                >
                  조금 더 집중하기
                </BtnAtom>
              )}
            </div>
          </div>
          <div className="indicator-container">
            {todo && (
              <div className="todo-duration">
                <TypoAtom
                  fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
                  fontSize={'h3'}
                >
                  {todo.duration + ' Round'}
                </TypoAtom>
                <TypoAtom
                  fontColor={isExtreme ? 'extreme_dark' : 'primary1'}
                  fontSize="h3"
                >
                  {todo.duration < 20
                    ? `🍅 `.repeat(todo.duration)
                    : `🍅 ` + todo.duration}
                </TypoAtom>
              </div>
            )}
          </div>

          <div className="progress-container">
            <TodoProgressBarAtom
              type={isExtreme ? 'extreme1' : 'primary1'}
              progress={Math.floor(
                ((pomodoro.time ?? 0) / (pomodoro.settings.restStep * 60000)) *
                  100,
              )}
            >
              <div className="progress"></div>
            </TodoProgressBarAtom>
          </div>
        </RestCardWrapper>
      )}
    </CardAtom>
  );
}

const RestCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  .center-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.875rem;
  }
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
    .focus {
      min-width: 100px;
      padding: 0 1rem;
    }
    .focusMore {
      text-decoration: underline;
    }
  }
  .todo-duration {
    height: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export default RestCard;
