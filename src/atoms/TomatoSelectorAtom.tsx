import styled from '@emotion/styled';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { formatTime } from '../shared/timeUtils';
import { PopperAtom } from './PopperAtom';
import { TypoAtom } from './TypoAtom';
import { useIsMobile } from '../hooks';

interface ITomatoSelectorProps {
  max: number;
  min: number;
  period: number;
  tomato: number;
  handleTomato: (count: number) => void;
  label?: string; // 라벨 추가
}

const TomatoSelectorAtom = ({
  max,
  min,
  period,
  tomato,
  handleTomato,
  label,
}: ITomatoSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [triggerWidth, setTriggerWidth] = useState(0);
  const isMobile = useIsMobile();

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
          <TypoAtom fontSize="h3" fontColor="primary1">
            {label}
          </TypoAtom>
        </LabelWrapper>
      )}
      <SelectedDisplay
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '0.25rem',
              marginRight: '0.6rem',
            }}
          >
            <TomatoIcon>🍅</TomatoIcon>
            <SelectedValue>{tomato} Round</SelectedValue>
          </div>
          <OrangeComboBox />
        </div>
        <SelectedValue className="formatted__time">
          {formatTime(tomato * period)}
          {!isMobile && ' 동안 집중'}
        </SelectedValue>
      </SelectedDisplay>

      {isOpen && (
        <PopperAtom
          triggerElement={triggerRef.current}
          popperElement={popperElement}
          setPopperElement={setPopperElement}
          placement="bottom-start"
          offset={[0, 5]}
          className="tomatoInputPopper"
        >
          <OptionList aria-label="tomatoInput">
            {Array.from({ length: tickCount + 1 }).map((_, index) => {
              const value = min + index;
              const isSelected = value === tomato;
              return (
                <OptionItem key={value} onClick={() => handleSelect(value)}>
                  <OptionText isSelected={isSelected}>{value} Round</OptionText>
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
  .tomatoInputPopper {
    width: fit-content;
    @media ${({ theme }) => theme.responsiveDevice.tablet_v},
      ${({ theme }) => theme.responsiveDevice.mobile} {
      width: 100%;
    }
  }
`;

const LabelWrapper = styled.div`
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
`;

const SelectedDisplay = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 11;

  &:active {
    transform: scale(0.98);
  }
`;

const TomatoIcon = styled.span`
  font-size: 1.5rem;
`;

const SelectedValue = styled.span`
  font-size: ${({ theme }) => theme.fontSize.h3.size};
  font-weight: ${({ theme }) => theme.fontSize.h3.weight};
  color: ${({ theme }) => theme.color.fontColor.extreme_orange};
  &.formatted__time {
    font-size: ${({ theme }) => theme.fontSize.body.size};
    font-weight: ${({ theme }) => theme.fontSize.body.weight};
  }
`;

const OptionList = styled.div`
  max-height: 7.125rem;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.color.backgroundColor.white};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadow.container};
  z-index: 1000;
  width: fit-content;

  overscroll-behavior: contain;

  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
  }
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  padding-right: 3.6875rem;
  cursor: pointer;

  &:hover {
    background-color: #dbfe7780;
    span {
      color: ${({ theme }) => theme.color.fontColor.extreme_orange};
    }
  }

  &:first-of-type {
    border-radius: 1rem 1rem 0 0;
  }

  &:last-child {
    border-radius: 0 0 1rem 1rem;
  }
`;

const OrangeComboBox = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  background: ${({ theme }) => theme.color.backgroundColor.extreme_orange};
  mask-image: url('/icon/combobox.svg');
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
`;

const OptionText = styled.span<{ isSelected: boolean }>`
  margin-left: 0.75rem;
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontSize.body.weight};
  color: ${({ isSelected, theme }) =>
    isSelected
      ? theme.color.fontColor.extreme_orange
      : theme.color.fontColor.primary1};
`;
