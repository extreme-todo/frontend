import { IChildProps } from '../shared/interfaces';

interface IBtnAtomProps extends IChildProps {
  handleOnClick: () => void;
}

function BtnAtom({ children, handleOnClick, ...props }: IBtnAtomProps) {
  return (
    <div onClick={handleOnClick} style={{ ...props, cursor: 'pointer' }}>
      {children}
    </div>
  );
}

export default BtnAtom;
