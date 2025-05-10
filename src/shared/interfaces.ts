import { ReactNode } from 'react';

export interface IChildProps {
  children?: ReactNode;
}

export interface IFocusTime<UnitType extends { focused: number }> {
  total: {
    start: string;
    end: string;
    focused: number;
    prevFocused: number;
  };
  values: UnitType[];
}

export interface IDayFocusedTime {
  start: number;
  end: number;
  focused: number;
}
export interface IWeekFocusedTime {
  day: string;
  focused: number;
}
export interface IMonthFocusedTime {
  week: string;
  focused: number;
}

export interface ICategory {
  name: string;
  id: number;
}

export interface ISettings {
  colorMode: 'auto' | 'dark' | 'light';
  extremeMode: boolean;
}
