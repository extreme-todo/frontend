import { BehaviorSubject, interval, share, tap } from 'rxjs';

export enum PomodoroFocusingStatus {
  NONE = 'NONE',
  FOCUSING = 'FOCUSING',
  RESTING = 'RESTING',
}

export enum PomodoroTimerStatus {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
}

export class PomodoroServiceClass {
  private PomodoroFocusingStatusSubject =
    new BehaviorSubject<PomodoroFocusingStatus>(PomodoroFocusingStatus.NONE);
  private PomodoroTimeSubject = new BehaviorSubject<number>(0);
  private PomodoroTimerStatusSubject = new BehaviorSubject<PomodoroTimerStatus>(
    PomodoroTimerStatus.RUNNING,
  );
  private static instance: PomodoroServiceClass;

  pomodoroFocusingStatus$ =
    this.PomodoroFocusingStatusSubject.asObservable().pipe(share());
  pomodoroTime$ = this.PomodoroTimeSubject.asObservable().pipe(share());
  pomodoroTimerStatus$ = this.PomodoroTimerStatusSubject.asObservable().pipe(
    share(),
  );

  constructor() {
    this.init();
  }

  private init() {
    this.PomodoroFocusingStatusSubject.next(PomodoroFocusingStatus.NONE);
    this.PomodoroTimeSubject.next(0);
    this.startTimer().subscribe();
  }

  public static getInstance(): PomodoroServiceClass {
    if (!PomodoroServiceClass.instance) {
      PomodoroServiceClass.instance = new PomodoroServiceClass();
    }
    return PomodoroServiceClass.instance;
  }

  setStatus(status: PomodoroFocusingStatus) {
    this.PomodoroFocusingStatusSubject.next(status);
    this.PomodoroTimeSubject.next(0);
  }

  pauseTimer() {
    this.PomodoroTimerStatusSubject.next(PomodoroTimerStatus.PAUSED);
  }

  resumeTimer() {
    this.PomodoroTimerStatusSubject.next(PomodoroTimerStatus.RUNNING);
  }

  private startTimer() {
    const processTimer = () => {
      if (
        this.PomodoroTimerStatusSubject.value === PomodoroTimerStatus.PAUSED
      ) {
        return;
      }
      this.PomodoroTimeSubject.next(this.PomodoroTimeSubject.value + 1000);
    };
    return interval(1000).pipe(tap(processTimer));
  }
}

export const PomodoroService = PomodoroServiceClass.getInstance();
