import TypoAtom from './TypoAtom';
import styled from '@emotion/styled';

interface ISwitchAtomProps {
  value: boolean;
  setValue: () => void;
}

function SwitchAtom({ value, setValue }: ISwitchAtomProps) {
  return (
    <SwitchContainter value={value} onClick={setValue}>
      <Switch value={value}>
        <TypoAtom fontColor={'primary1'} fontSize={'body'}>
          {/* TODO : string을 외부에서 주입받을 수 있도록 하기 -> 확장성이 더 개선되고 아톰이라는 말에 더 어울림 */}
          {value ? `ON` : `OFF`}
        </TypoAtom>
      </Switch>
    </SwitchContainter>
  );
}

export default SwitchAtom;

// TODO : 색 피그마에 맞게 수정하기
const Switch = styled.div<{ value: boolean }>`
  width: 4.074375rem;
  height: 2.5rem;
  border-radius: 2.5rem;
  display: flex;
  justify-content: ${({ value }) => (value ? 'flex-start' : 'flex-end')};
  align-items: center;
  background-color: ${({ theme: { color } }) => color.primary.primary2};

  & > span {
    width: 100%;
    text-align: center;
  }
`;

const SwitchContainter = styled.div<Partial<ISwitchAtomProps>>`
  background-color: ${({ theme: { color } }) => color.primary.primary1};
  width: 5.5rem;
  min-width: 4.5rem;
  height: 2.5rem;
  border-radius: 2.5rem;
  display: flex;
  justify-content: ${(props) => (props.value ? 'flex-end' : 'flex-start')};
  padding: 0.1875rem;
`;
