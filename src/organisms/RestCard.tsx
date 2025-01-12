import { CardAtom, TagAtom, TypoAtom } from '../atoms';
import { usersApi } from '../shared/apis';

export interface IRestCardProps {
  shouldFocus: boolean;
  isLogin: boolean;
  startFocusing: () => void;
  canRest: boolean;
  doTodo: () => void;
  isExtreme: boolean;
}

function RestCard({
  shouldFocus,
  isLogin,
  startFocusing,
  canRest,
  doTodo,
  isExtreme,
}: IRestCardProps) {
  return (
    <CardAtom
      w="53.75rem"
      h="20rem"
      padding="2rem 2.75rem"
      className="card"
      bg={isExtreme ? 'extreme_dark' : 'primary2'}
    >
      <TypoAtom fontSize="h1" fontColor="primary1">
        {shouldFocus ? '휴식 종료' : '휴식'}
      </TypoAtom>
      <button
        onClick={() => {
          if (!isLogin) {
            if (window.confirm('로그인을 하시겠습니까?')) {
              return usersApi.login();
            }
          } else {
            startFocusing();
          }
        }}
        className="end-rest-button"
      >
        <TagAtom
          styleOption={{
            bg: 'purple',
            size: 'normal',
            fontsize: 'body',
          }}
        >
          {canRest
            ? '조금 더 집중하기'
            : shouldFocus
            ? '다음 할 일을 시작하세요'
            : '종료'}
        </TagAtom>
      </button>
      {canRest && (
        <button
          onClick={() => {
            if (!isLogin) {
              if (window.confirm('로그인을 하시겠습니까?')) {
                return usersApi.login();
              }
            } else {
              doTodo();
            }
          }}
          className="end-rest-button"
        >
          <TagAtom
            styleOption={{
              bg: 'brown',
              size: 'normal',
              fontsize: 'body',
            }}
          >
            다음 할 일 하기
          </TagAtom>
        </button>
      )}
    </CardAtom>
  );
}

export default RestCard;
