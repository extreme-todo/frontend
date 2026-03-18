import { memo } from 'react';
import { TypoAtom } from '../../../atoms';

interface IHandleIconAndOrderProps {
  done: boolean;
  order: number;
}

export const HandlerIconAndOrder = memo(
  ({ done, order }: IHandleIconAndOrderProps) => {
    if (done) return null;
    return (
      <TypoAtom fontSize="h3" fontColor="primary2">
        {order}.
      </TypoAtom>
    );
  },
);
