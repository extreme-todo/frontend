import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PomodoroProvider,
  ExtremeModeProvider,
  CurrentTodoProvider,
} from '../hooks';
import { ResponsiveProvider } from './ResponsiveContext';

interface AppProvidersProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const AppProviders: React.FC<AppProvidersProps> = ({
  children,
  queryClient,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ResponsiveProvider>
        <PomodoroProvider>
          <CurrentTodoProvider>
            <ExtremeModeProvider>{children}</ExtremeModeProvider>
          </CurrentTodoProvider>
        </PomodoroProvider>
      </ResponsiveProvider>
    </QueryClientProvider>
  );
};
