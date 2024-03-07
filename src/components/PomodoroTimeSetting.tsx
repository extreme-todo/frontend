import { useState } from 'react';

import { BtnAtom, TypoAtom } from '../atoms';
import { FlipCounter } from '../molecules';

interface ITimeCounterProps {
  flipData: Array<number>;
  title: string;
  initFlipIndex: number;
}

const TimeSetter = ({ flipData, title, initFlipIndex }: ITimeCounterProps) => {
  const [flipIndex, setFlipIndex] = useState(initFlipIndex);
  const [isPlus, setIsPlus] = useState(false);

  const handlePlus = () => {
    setFlipIndex((prev) => (prev >= flipData.length - 1 ? prev : prev + 1));
    setIsPlus(true);
  };
  const handleMinus = () => {
    setFlipIndex((prev) => (prev <= 0 ? prev : prev - 1));
    setIsPlus(false);
  };

  return (
    <>
      <TypoAtom>{title}</TypoAtom>
      <BtnAtom handleOnClick={handlePlus}>
        <img alt="timeup" src={'icons/PolygonUp'} />
      </BtnAtom>
      <FlipCounter>
        {flipData.map((data) => (
          <FlipCounter.Flipper
            key={data}
            className={
              (data === flipData[flipIndex - 1] ? 'prev' : '') +
              (data === flipData[flipIndex] ? 'curr ' : '') +
              (data === flipData[flipIndex + 1] ? 'next ' : '')
            }
            isPlus={isPlus}
            flipNumber={data}
          />
        ))}
      </FlipCounter>
      <TypoAtom>분</TypoAtom>
      <BtnAtom handleOnClick={handleMinus}>
        <img alt="timedown" src={'icons/PolygonDown'} />
      </BtnAtom>
    </>
  );
};

const PomodoroTimeSetting = () => {
  return <div></div>;
};

export default PomodoroTimeSetting;
export { TimeSetter };
