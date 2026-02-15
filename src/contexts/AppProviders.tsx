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

interface AppProvidersProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const AppProviders: React.FC<AppProvidersProps> = ({
  children,
  queryClient,
}) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <LoginProvider>
        <QueryClientProvider client={queryClient}>
          <ResponsiveProvider>
            <PomodoroProvider>
              <CurrentTodoProvider>
                <ExtremeModeProvider>{children}</ExtremeModeProvider>
              </CurrentTodoProvider>
            </PomodoroProvider>
          </ResponsiveProvider>
        </QueryClientProvider>
      </LoginProvider>
    </ThemeProvider>
  );
};
