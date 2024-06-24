import { format } from 'date-fns';
import { TodoEntity } from '../DB/indexedAction';

type FormatTimeType = `${number}:${number}:${number}`;

/**
 * 분을 입력하면 일,시간,분으로 변환해주는 포매터
 * @param time min ex) 720
 * @returns ex) 12시간 0분
 */
export const formatTime = (time: number): string => {
  const isMinus = time < 0;
  time = Math.abs(time);
  if (time >= 6000) {
    const hours = time % 1440;
    return (
      Math.floor(time / 1440) +
      '일 ' +
      Math.floor(hours / 60) +
      '시간 ' +
      (hours % 60) +
      '분'
    );
  }
  if (time >= 60) {
    return Math.floor(time / 60) + '시간 ' + (time % 60) + '분';
  }
  return (isMinus ? '-' : '') + time + '분';
};

/**
 * calendarInput에서 오늘 날짜를 선택하면 시간은 현재 시간이 된다.
 * 하지만 ET 내부 규칙에 따라
 * local 기준으로 시간이 00:00:00인 상황에서 UTC로 변환해야 한다.
 * setTimeInFormat은 이런 규칙을 준수하기 위해 사용된다.
 * date-fns의 setMinutes와 같은 메소드를 사용해서 시간을 설정해도 되지만,
 * 그렇게 하면 시간, 분, 초 각각에 메소드를 사용해주어야 하기 때문에 이 함수를 만들었다.
 * @param date
 * @returns
 */
export const setTimeInFormat = (
  date: Date,
  time: FormatTimeType = '00:00:00',
) => {
  return new Date(`${getDateInFormat(date)} ${time}`);
};

/**
 * 일반 Date 타입의 형식이 오면 해당 primitive value의 연,월,일을 가지고 온다.
 * '2024-05-22T15:00:00'처럼 UTC형식이 오면 local time으로 변환하지 않고
 * 2024-05-22을 그대로 가지고 온다.
 * @param date
 * @returns {string} yyyy-mm-dd 형식으로 반환한다.
 */
export const getDateInFormat = (date: Date): string => {
  return format(date, 'y-MM-dd');
};

export const groupByDate = (todos: TodoEntity[]) => {
  const todosMap = new Map<string, TodoEntity[]>();
  for (const todo of todos) {
    const convertedDate = getDateInFormat(new Date(todo.date));
    const group = todosMap.get(convertedDate) || [];
    group.push(todo);
    todosMap.set(convertedDate, group);
  }
  return todosMap;
};

/**
 * 뽀모도로 단위와 현재 진행 시간 비율을 백분율로 리턴
 * - ex) 890000, 30, 5
 * - 30분 단위의 뽀모도로 5개 분량(2시간 30분)이 목표시간이며, 현재 890000ms만큼 진행했을 경우
 * - 30 * 5 = 150 분 = 9000000 밀리초
 * - 890000 / 9000000 * 100 = 약 9.9%
 * - => 9.9 리턴
 */
export const getPomodoroStepPercent = ({
  curr,
  step,
  unit,
}: {
  curr: number; // 현재 진행시간 (ms)
  step: number; // 뽀모도로 단위 (min) ex) 30
  unit: number; // 뽀모도로 개수
}) => {
  return ((curr / (step * unit * 60000)) * 100).toFixed(1);
};
