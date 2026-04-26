import styled from '@emotion/styled';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { formatTime } from '../shared/timeUtils';
import { PopperAtom } from './PopperAtom';
import { TypoAtom } from './TypoAtom';

interface ITomatoSelectorProps {
  max: number;
  min: number;
  period: number;
  tomato: number;
  handleTomato: (count: number) => void;
  isExtreme?: boolean;
  label?: string; // 라벨 추가
}

const TomatoSelectorAtom = ({
  max,
  min,
  period,
  tomato,
  handleTomato,
  isExtreme,
  label,
}: ITomatoSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [triggerWidth, setTriggerWidth] = useState(0);

  const tickCount = max - min;

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        popperElement &&
        !popperElement.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, popperElement]);

  const handleSelect = (value: number) => {
    handleTomato(value);
    setIsOpen(false);
  };

  return (
    <SelectorWrapper>
      {label && (
        <LabelWrapper>
          <TypoAtom
            fontSize="h3"
            fontColor={isExtreme ? 'primary2' : 'primary1'}
          >
            {label}
          </TypoAtom>
        </LabelWrapper>
      )}
      <SelectedDisplay
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        isExtreme={isExtreme}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TomatoIcon>🍅</TomatoIcon>
          <SelectedValue>
            {tomato}회 ({formatTime(tomato * period)})
          </SelectedValue>
        </div>
        <ArrowIcon isOpen={isOpen}>▲</ArrowIcon>
      </SelectedDisplay>

      {isOpen && (
        <PopperAtom
          triggerElement={triggerRef.current}
          popperElement={popperElement}
          setPopperElement={setPopperElement}
          placement="bottom-start"
          offset={[0, 0]}
        >
          <OptionList
            isExtreme={isExtreme}
            style={{ width: triggerWidth }}
            aria-label="tomatoInput"
          >
            {Array.from({ length: tickCount + 1 }).map((_, index) => {
              const value = min + index;
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
        </PopperAtom>
      )}
    </SelectorWrapper>
  );
};

export { TomatoSelectorAtom };

const SelectorWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const LabelWrapper = styled.div`
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
`;

const SelectedDisplay = styled.div<{ isOpen: boolean; isExtreme?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 11;
  border: 1px solid ${({ theme }) => theme.color.backgroundColor.gray};

  &:active {
    transform: scale(0.98);
  }
`;

const TomatoIcon = styled.span`
  font-size: 1.5rem;
`;

const SelectedValue = styled.span`
  margin-left: 0.75rem;
  font-size: ${({ theme }) => theme.fontSize.body.size};
  font-weight: ${({ theme }) => theme.fontSize.b1.weight};
  color: ${({ theme }) => theme.color.fontColor.extreme_orange};
`;

const ArrowIcon = styled.span<{ isOpen: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.fontColor.extreme_orange};
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

const OptionList = styled.div<{ isExtreme?: boolean }>`
  max-height: 150px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadow.tomato};
  z-index: 1000;
  border: 1px solid ${({ theme }) => theme.color.backgroundColor.gray};

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
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.backgroundColor.gray : 'transparent'};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.backgroundColor.gray};
  }

  &:first-of-type {
    border-radius: 1rem 1rem 0 0;
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
  color: ${({ theme }) => theme.color.fontColor.extreme_dark};
`;
