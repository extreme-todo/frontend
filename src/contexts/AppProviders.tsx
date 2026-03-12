import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PomodoroProvider,
  ExtremeModeProvider,
  CurrentTodoProvider,
  LoginProvider,
} from '../hooks';
import { ResponsiveProvider } from './ResponsiveContext';
import GlobalStyle from '../styles/Global';
import { designTheme as Theme } from '../styles/theme';
import { ThemeProvider } from '@emotion/react';

interface ChildrenProps {
  children: ReactNode;
}

/**
 * 1. UI/Style Layer
 */
export const UIProviders: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <ResponsiveProvider>{children}</ResponsiveProvider>
    </ThemeProvider>
  );
};

/**
 * 2. Data Access Layer
 */
export const QueryProvider: React.FC<{
  children: ReactNode;
  queryClient: QueryClient;
}> = ({ children, queryClient }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

/**
 * 3. Business Logic Layer
 * 주의: QueryProvider 내부에서 사용해야 함
 */
export const LogicProviders: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <LoginProvider>
      <PomodoroProvider>
        <CurrentTodoProvider>
          <ExtremeModeProvider>{children}</ExtremeModeProvider>
        </CurrentTodoProvider>
      </PomodoroProvider>
    </LoginProvider>
  );
};

/**
 * Full Application Stack
 */
export const AppProviders: React.FC<{
  children: ReactNode;
  queryClient: QueryClient;
}> = ({ children, queryClient }) => {
  return (
    <UIProviders>
      <QueryProvider queryClient={queryClient}>
        <LogicProviders>{children}</LogicProviders>
      </QueryProvider>
    </UIProviders>
  );
};
