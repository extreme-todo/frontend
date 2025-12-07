import { BehaviorSubject, interval, share, tap } from 'rxjs';

export enum PomodoroStatus {
  NONE,
  FOCUSING,
  RESTING,
}

const PomodoroStatusSubject = new BehaviorSubject<PomodoroStatus>(
  PomodoroStatus.NONE,
);
const PomodoroTimeSubject = new BehaviorSubject<number>(0);

export const PomodoroService = {
  pomodoroStatus$: PomodoroStatusSubject.asObservable().pipe(share()), // setStatus가 업데이트
  pomodoroTime$: PomodoroTimeSubject.asObservable().pipe(share()), // startTimer가 업데이트
  setStatus: (status: PomodoroStatus) => {
    PomodoroStatusSubject.next(status);
    PomodoroTimeSubject.next(0);
  },
  startTimer: () => {
    return interval(1000).pipe(
      tap(() => {
        PomodoroTimeSubject.next(PomodoroTimeSubject.value + 1000);
      }),
    );
  },
};
