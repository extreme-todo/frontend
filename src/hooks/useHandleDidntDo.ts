import { milliseconds, startOfYesterday } from 'date-fns';
import { useContext, useEffect, useRef } from 'react';
import { setTimeInFormat } from '../shared/timeUtils';
import { todosApi } from '../shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PomodoroService } from '../services/PomodoroService';
import { LoginContext } from './LoginContext';

export const useHandleDidntDo = () => {
  const { isLogin } = useContext(LoginContext);
  const queryClient = useQueryClient();
  const storageCriterion = useRef<number | null>(null);
  const { mutate, isLoading } = useMutation({
    mutationFn: (currentDate: string) => todosApi.removeDidntDo(currentDate),
    retry: false,
    onSuccess(data) {
      console.debug(
        '\n\n\n ✅ data in useTimeMarker‘s useMutation ✅ \n\n',
        data,
      );
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
      if (storageCriterion.current !== null)
        localStorage.setItem(
          'removeDidntDo',
          JSON.stringify(storageCriterion.current),
        );
    },
    onError(error: AxiosError) {
      console.debug(
        '\n\n\n 🚨 error in useTimeMarker‘s useMutation 🚨 \n\n',
        error,
      );
    },
  });
  useEffect(() => {
    const checkTimeOver = () => {
      const lastRemoveTimeStr = localStorage.getItem('removeDidntDo');
      if (!lastRemoveTimeStr) return true;
      const lastRemoveTime = JSON.parse(lastRemoveTimeStr) as number | null;
      let parsingLastRemoveTime: number;
      if (!lastRemoveTime) {
        return true;
      } else {
        parsingLastRemoveTime = Number(lastRemoveTime);
        return (
          new Date().getTime() - parsingLastRemoveTime >=
          milliseconds({ days: 1 })
        );
      }
    };

    const getCriterion = (): [string, number] => {
      const FIVE_AM = '05:00:00';
      let setTimeInFormatParam: Date;
      let setTimeMakerParam: Date;
      if (new Date().getHours() >= 5) {
        // 2. 하루 이상 지났다면, 다음날 새벽 5시를 넘겼다면,
        // 2-1. todosApi.removeDidntDo()를 호출한다.
        setTimeInFormatParam = setTimeInFormat(new Date());
        // 2-2. 로컬 스토리지에 호출을 기록한다. 이때 호출한 날짜의 새벽 5시를 기준으로 milliseconds를 기록한다.
        setTimeMakerParam = setTimeInFormat(new Date(), FIVE_AM);
      } else {
        // 3. 하루 이상 지났다면, 새벽 5시를 넘기지 않았다면(00, 01, 02, 03, 04시),
        // 3-1. 전날을 기준으로 todosApi.removeDidntDo()를 호출한다.
        setTimeInFormatParam = setTimeInFormat(startOfYesterday());
        // 3-2. 전날을 기준으로 로컬 스토리지에 호출을 기록한다. 전날 새벽 5시를 기준으로 milliseconds를 기록한다.
        setTimeMakerParam = setTimeInFormat(startOfYesterday(), FIVE_AM);
      }
      return [setTimeInFormatParam.toISOString(), setTimeMakerParam.getTime()];
    };
    const subTime = PomodoroService.pomodoroTime$.subscribe(() => {
      if (!isLogin) return;
      const isAfterFiveAM = checkTimeOver();
      if (isAfterFiveAM && !isLoading) {
        const criteria = getCriterion();
        storageCriterion.current = criteria[1];
        mutate(criteria[0]);
      }
    });
    return () => {
      subTime.unsubscribe();
    };
  }, [mutate]);
};
