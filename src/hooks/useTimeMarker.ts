import { milliseconds, startOfYesterday } from 'date-fns';
import { useEffect } from 'react';
import {
  checkTimeOverFromTimeMarker,
  setTimeInFormat,
  setTimeMarker,
} from '../shared/timeUtils';
import { todosApi } from '../shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const handleDintDo = async () => {
  const DIDNT_DO = 'removeDidntDo';
  const FIVE_AM = '05:00:00';
  // 1. 로컬 스토리지에서 호출 기록을 가지고 와서 miliseconds 단위로 얼마나 지났는지 확인한다.
  const oneDayMiliseconds = milliseconds({ days: 1 });
  // 4. 예외처리로 localStorage가 비어있다면 반드시 removeDidntDo를 호출하고 localStorage에 호출시간을 기록한다.
  const isOver = checkTimeOverFromTimeMarker(DIDNT_DO, oneDayMiliseconds);

  if (isOver) {
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

    await todosApi.removeDidntDo(setTimeInFormatParam.toISOString());
    setTimeMarker(DIDNT_DO, setTimeMakerParam.getTime());
  }
};

export const useTimeMarker = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: handleDintDo,
    onSuccess(data: any) {
      console.debug(
        '\n\n\n ✅ data in useTimeMarker‘s useMutation ✅ \n\n',
        data,
      );
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
    },
    onError(error: AxiosError) {
      console.debug(
        '\n\n\n 🚨 error in useTimeMarker‘s useMutation 🚨 \n\n',
        error,
      );
    },
  });
  useEffect(() => {
    mutate();
  }, []);
};
