import { ReactNode } from 'react';

export interface IChildProps {
  children?: ReactNode;
}

export interface ITotalFocusTime {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface IRecords {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface IRanking {
  group: Record<string, number>[];
  user: {
    id: number;
    time: number;
  };
}

export interface ICategory {
  name: string;
  id: number;
}

export interface ISettings {
  colorMode: 'auto' | 'dark' | 'light';
  extremeMode: boolean;
}
