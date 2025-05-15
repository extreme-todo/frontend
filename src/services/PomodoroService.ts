import { BehaviorSubject, interval, share, tap } from 'rxjs';

export enum PomodoroStatus {
  NONE,
  FOCUSING,
  RESTING,
  OVERFOCUSING,
}
export const PomodoroStatusSubject = new BehaviorSubject<PomodoroStatus>(
  PomodoroStatus.NONE,
);
export const PomodoroTimeSubject = new BehaviorSubject<number>(0);

export const PomodoroService = {
  pomodoroStatus$: PomodoroStatusSubject.asObservable().pipe(share()),
  pomodoroTime$: PomodoroTimeSubject.asObservable().pipe(share()),
  setStatus: (status: PomodoroStatus) => {
    PomodoroStatusSubject.next(status);
    PomodoroTimeSubject.next(0);
  },
  startTimer: () => {
    interval(1000)
      .pipe(
        tap(() => {
          PomodoroTimeSubject.next(PomodoroTimeSubject.value + 1000);
        }),
      )
      .subscribe();
  },
};
