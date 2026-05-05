import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

export type HelpType = 'main' | 'list' | 'new' | 'rest' | 'time' | 'ranking';

interface HelpModalAtomProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  type: HelpType;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #929293;
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const HelpImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  object-fit: contain;
  pointer-events: none;
`;

export const HelpModalAtom: React.FC<HelpModalAtomProps> = ({
  isOpen,
  onClose,
  isMobile,
  type,
}) => {
  const imagePath = `/Images/help_${type}_${
    isMobile ? 'mobile' : 'desktop'
  }.png`;

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <HelpImage
            key={imagePath}
            src={imagePath}
            alt={`${type} help`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          />
        </Overlay>
      )}
    </AnimatePresence>
  );
};
