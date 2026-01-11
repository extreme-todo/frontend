import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';
import { formatTime } from '../shared/timeUtils';

interface ITomatoSelectorProps {
  max: number;
  min: number;
  period: number;
  tomato: number;
  handleTomato: (count: number) => void;
  isExtreme?: boolean;
}

const TomatoSelectorAtom = ({
  max,
  min,
  period,
  tomato,
  handleTomato,
  isExtreme,
}: ITomatoSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const tickCount = max - min;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: number) => {
    handleTomato(value);
    setIsOpen(false);
  };

  return (
    <SelectorWrapper ref={selectorRef}>
      <SelectedDisplay
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        isExtreme={isExtreme}
      >
        <TomatoIcon>🍅</TomatoIcon>
        <SelectedValue>
          {tomato}회 ({formatTime(tomato * period)})
        </SelectedValue>
        <ArrowIcon isOpen={isOpen}>▼</ArrowIcon>
      </SelectedDisplay>
      {isOpen && (
        <OptionList isExtreme={isExtreme}>
          {Array.from({ length: tickCount }).map((_, index) => {
            const value = index + 1;
            const isSelected = value === tomato;
            return (
              <OptionItem
                key={value}
                onClick={() => handleSelect(value)}
                isSelected={isSelected}
                isExtreme={isExtreme}
              >
                <OptionTomato isSelected={isSelected}>🍅</OptionTomato>
                <OptionText>
                  {value}회 ({formatTime(value * period)})
                </OptionText>
              </OptionItem>
            );
          })}
        </OptionList>
      )}
    </SelectorWrapper>
  );
};

export { TomatoSelectorAtom };

const SelectorWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectedDisplay = styled.div<{ isOpen: boolean; isExtreme?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: ${({ isOpen }) => (isOpen ? '0 0 1rem 1rem' : '1rem')};
  background-color: ${({ theme, isExtreme }) =>
    isExtreme
      ? theme.color.backgroundColor.light_extreme_dark
      : theme.color.backgroundColor.dark_primary1};
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const TomatoIcon = styled.span`
  font-size: 1.5rem;
`;

const SelectedValue = styled.span`
  flex: 1;
  margin-left: 0.75rem;
  font-size: ${({ theme }) => theme.fontSize.b1.size};
  font-weight: ${({ theme }) => theme.fontSize.b1.weight};
  color: ${({ theme }) => theme.color.fontColor.white};
`;

const ArrowIcon = styled.span<{ isOpen: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.fontColor.primary2};
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

const OptionList = styled.div<{ isExtreme?: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${({ theme, isExtreme }) =>
    isExtreme
      ? theme.color.backgroundColor.extreme_dark
      : theme.color.backgroundColor.primary1};
  border-radius: 1rem 1rem 0 0;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadow.tomato};

  overscroll-behavior: contain;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.fontColor.gray};
    border-radius: 3px;
  }
`;

const OptionItem = styled.div<{ isSelected: boolean; isExtreme?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: ${({ isSelected, theme, isExtreme }) =>
    isSelected
      ? isExtreme
        ? theme.color.backgroundColor.light_extreme_dark
        : theme.color.backgroundColor.dark_primary1
      : 'transparent'};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme, isExtreme }) =>
      isExtreme
        ? theme.color.backgroundColor.light_extreme_dark
        : theme.color.backgroundColor.dark_primary1};
  }

  &:last-child {
    border-radius: 0 0 1rem 1rem;
  }
`;

const OptionTomato = styled.span<{ isSelected: boolean }>`
  font-size: 1.25rem;
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.6)};
  transition: opacity 0.15s ease;
`;

const OptionText = styled.span`
  margin-left: 0.75rem;
  font-size: ${({ theme }) => theme.fontSize.b2.size};
  font-weight: ${({ theme }) => theme.fontSize.b2.weight};
  color: ${({ theme }) => theme.color.fontColor.white};
`;
