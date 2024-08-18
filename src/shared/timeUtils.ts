import { format } from 'date-fns';
import { TodoEntity } from '../DB/indexedAction';

type FormatTimeType = `${number}:${number}:${number}`;

export type ITimeMarkerKey = 'removeDidntDo';
export type ITimeMarkerObject = Record<ITimeMarkerKey, number | undefined>;

export const ET_TIME_MARKER = 'ETTimeMarker';

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

/**
 * 특정 함수를 호출한지 일정기간이 지났는지 판단하는 유틸 함수입니다.
 * 일정기간이 지났는지에 대한 마킹은 localStorage에 저장된 ETTimeMarker이라는 키를 가지는 객체 데이터로 판단합니다.
 * 객체의 프로퍼티 키는 함수명으로 하고, 프로퍼티 값은 기준 시일의 밀리세컨드로 합니다.
 * 예를 들어 removeDidntDo에 대한 호출을 핸들링 하기 위해서는,
 * 마지막으로 호출한 기준일 새벽 5시를 기준으로 한 밀리세컨트를 프로퍼티 값으로 설정해줍니다.
 * ETTimeMarker = { removeDidntDo:밀리세컨드, }
 * @param {string} key 함수명
 * @param {number} conditionalMilliSec 함수를 호출한 기준 시일의 밀리세컨드
 * @returns {boolean} 찾는 것이 없거나 시간을 초과해서 업데이트를 해야하면 true를 반환하고 찾는 것이 있고 시간 초과를 하지 않아서 업데이트를 할 필요가 없다면 false를 줍니다.
 */
export const checkTimeOverFromTimeMarker = (
  key: ITimeMarkerKey,
  conditionalMilliSec: number,
): boolean => {
  const timeMarker = localStorage.getItem(ET_TIME_MARKER);

  if (!timeMarker) {
    return true; // api 실행 및 setItem
  } else {
    const parsingMarker = (JSON.parse(timeMarker) as ITimeMarkerObject)[key];
    if (!parsingMarker) return true; // api 실행 및 setItem
    else if (new Date().getTime() - parsingMarker >= conditionalMilliSec)
      return true; // api 실행 및 setItem
    else return false; // api 실행 X
  }
};

/**
 * localstorage에 ETTimeMarker키값으로 데이터를 설정하는 유틸 함수입니다.
 * ETTimeMarker데이터가 아예 없거나,
 * ETTimeMarker데이터는 있으나 key값으로 들어온 함수가 객체 프로퍼티에 없거나, 있을 경우를 고려해서 업데이트를 합니다.
 * @param {ITimeMarkerKey} key 함수명
 * @param {number} value 밀리세컨드
 * @returns
 */
export const setTimeMarker = (key: ITimeMarkerKey, value: number) => {
  const timeMarker = localStorage.getItem(ET_TIME_MARKER);
  // ETTimeMarker 키에 대한 데이터 자체가 없으면 설정해줍니다.
  if (!timeMarker)
    return localStorage.setItem(
      ET_TIME_MARKER,
      JSON.stringify({ [key]: value }),
    );
  // 나머지 경우,
  // 1. ETTimeMarker는 있는데 찾을려는 함수(key)가 없는 경우
  // 2. 함수(key)도 있는 경우
  // 위 두 경우 모두 해당 키 값에 새로운 값(value)을 포함해서 설정해줍니다.
  else {
    const parsingTimeMarker = JSON.parse(timeMarker) as ITimeMarkerObject;
    parsingTimeMarker[key] = value;
    return localStorage.setItem(
      ET_TIME_MARKER,
      JSON.stringify(parsingTimeMarker),
    );
  }
};
