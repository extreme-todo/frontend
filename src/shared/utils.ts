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
