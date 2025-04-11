import { motion, MotionValue } from 'framer-motion';

interface IListAtomProps {
  children: string;
  labelOpacity: number;
  handleClick: () => void;
  dotScale: MotionValue<number>;
  dotOpacity: MotionValue<number>;
}

const ListAtom = ({
  children,
  labelOpacity,
  handleClick,
  dotScale,
  dotOpacity,
}: IListAtomProps) => {
  return (
    <li className="navigation" onClick={handleClick}>
      <motion.div
        style={{ opacity: dotOpacity, scale: dotScale }}
        className="navigation__dot"
      />
      <motion.span
        animate={{
          opacity: labelOpacity,
          transition: { duration: 0.3 },
        }}
        className="navigation__label"
      >
        {children}
      </motion.span>
    </li>
  );
};

export { ListAtom };
