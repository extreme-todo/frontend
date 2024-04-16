import { TagAtom, TypoAtom } from '../atoms';

import styled from '@emotion/styled';
import { CategoryContainer } from './TodoCard/content/TodoUI';

import { TodoEntity } from '../DB/indexedAction';
import { focusStep } from '../hooks/usePomodoro';

interface INowCardProps {
  currentTodo: TodoEntity;
  focusStep: focusStep;
}

// TODO : undefiend 일 때 fallbackUI를 보여줄까?..
const NowCard = ({ currentTodo, focusStep }: INowCardProps) => {
  /* 시간 로직 */
  const durationMin = currentTodo?.duration * focusStep;
  const timeM = () => {
    let min: number;
    if (durationMin < 60) {
      min = durationMin;
    } else {
      min = durationMin % 60;
    }
    return String(min).padStart(2, '0') + '분';
  };
  const timeH = () => {
    if (durationMin < 60) return '';
    return String(Math.floor(Number(durationMin) / 60)) + '시간 ';
  };
  const time = timeH() + timeM();

  return (
    <>
      <TypoAtom fontColor="whiteWine" fontSize="body_bold">
        NOW
      </TypoAtom>
      <NowCardContainer>
        <TypoAtom fontSize="h2">{currentTodo?.todo}</TypoAtom>
        <CurrentTodoInfoContainer>
          <TagAtom
            styleOption={{
              fontsize: 'sm',
              size: 'sm',
              bg: 'transparent',
            }}
          >
            <TypoAtom>{'⏱️ ' + time}</TypoAtom>
          </TagAtom>
          {currentTodo?.categories?.map((el) => {
            let category: string;
            if (typeof el === 'string') category = el;
            else category = el.name;

            return (
              <TagAtom
                key={category}
                title={category}
                styleOption={{
                  fontsize: 'sm',
                  size: 'sm',
                  bg: 'whiteWine',
                  maxWidth: 10,
                }}
              >
                {category}
              </TagAtom>
            );
          })}
        </CurrentTodoInfoContainer>
      </NowCardContainer>
    </>
  );
};

export default NowCard;

const NowCardContainer = styled.div`
  display: flex;
  flex-direction: column;

  background: linear-gradient(#fcfcf4 30%, #f7f8e2 60%, #f0f1c7);
  border-radius: 1.4525rem;

  padding: 1.3125rem 1.8125rem;
  margin-top: 5px;
  margin-bottom: 2.684375rem;
`;

const CurrentTodoInfoContainer = styled(CategoryContainer)`
  margin-top: 1rem;
  > :first-of-type {
    margin-right: 0.875rem;
    span:first-of-type {
      padding: 0.38rem 0.1rem 0.38rem 0;
    }
  }
`;
