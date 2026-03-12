import { BehaviorSubject, interval, share, Subscription, tap } from 'rxjs';

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
  private PomodoroTimerSubscription: Subscription | null = null;
  private PomodoroInterval = 1000;
  private PomodoroSpeed = 1;
  private isDevelopmentMode = process.env.NODE_ENV === 'development';
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
    this.startTimer();
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

  getPomodoroTickInterval() {
    return this.PomodoroInterval;
  }

  setTime(time: number) {
    this.PomodoroTimeSubject.next(time);
  }

  pauseTimer() {
    this.PomodoroTimerStatusSubject.next(PomodoroTimerStatus.PAUSED);
  }

  resumeTimer() {
    this.PomodoroTimerStatusSubject.next(PomodoroTimerStatus.RUNNING);
  }

  private startTimer() {
    if (this.PomodoroTimerSubscription != null) {
      this.PomodoroTimerSubscription.unsubscribe();
      this.PomodoroTimerSubscription = null;
    }
    const processTimer = () => {
      if (
        this.PomodoroTimerStatusSubject.value === PomodoroTimerStatus.PAUSED
      ) {
        return;
      }
      this.PomodoroTimeSubject.next(
        this.PomodoroTimeSubject.value + this.PomodoroInterval,
      );
    };
    this.PomodoroTimerSubscription = interval(
      this.PomodoroInterval / this.PomodoroSpeed,
    )
      .pipe(tap(processTimer))
      .subscribe();
  }

  dispose() {
    if (this.PomodoroTimerSubscription) {
      this.PomodoroTimerSubscription.unsubscribe();
      this.PomodoroTimerSubscription = null;
    }
  }

  setPomodoroSpeed(speed: number) {
    if (this.isDevelopmentMode === false) {
      console.warn(
        'Pomodoro interval can be changed only in development mode.',
      );
      return;
    }
    this.PomodoroSpeed = speed;
    this.startTimer();
  }

  getPomodoroSpeed() {
    return this.PomodoroSpeed;
  }
}

export const PomodoroService = PomodoroServiceClass.getInstance();
