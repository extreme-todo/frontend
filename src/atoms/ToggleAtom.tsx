import styled from '@emotion/styled';
import { memo } from 'react';

interface IToggleAtomProps {
  isOn: boolean;
  onToggle: () => void;
  className?: string;
  ariaLabel?: string;
}

export const ToggleAtom = memo(
  ({ isOn, onToggle, className, ariaLabel }: IToggleAtomProps) => {
    return (
      <ToggleWrapper
        className={className}
        onClick={onToggle}
        isOn={isOn}
        role="switch"
        aria-checked={isOn}
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <ToggleText isOn={isOn}>{isOn ? 'ON' : 'OFF'}</ToggleText>
        <ToggleHandle isOn={isOn} />
      </ToggleWrapper>
    );
  },
);

const ToggleWrapper = styled.div<{ isOn: boolean }>`
  width: 4.25rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: ${({ theme, isOn }) =>
    isOn
      ? theme.color.backgroundColor.extreme_orange
      : theme.color.backgroundColor.primary1 + 'A1'};
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease-in-out;
  user-select: none;
  box-sizing: border-box;
`;

const ToggleHandle = styled.div<{ isOn: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ isOn }) => (isOn ? 'calc(100% - 1.75rem)' : '0.25rem')};
  transition: left 0.2s ease-in-out;
  z-index: 2;
`;

const ToggleText = styled.span<{ isOn: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.b2.size};
  font-weight: ${({ theme }) => theme.fontSize.b2.weight};
  color: ${({ theme, isOn }) =>
    isOn ? theme.color.fontColor.white : theme.color.fontColor.white};
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ isOn }) => (isOn ? '0.75rem' : 'auto')};
  right: ${({ isOn }) => (isOn ? 'auto' : '0.5rem')};
  transition: all 0.2s ease-in-out;
  z-index: 1;
  line-height: 1;
`;
