import { BehaviorSubject, interval, share, tap } from 'rxjs';

export enum PomodoroStatus {
  NONE,
  FOCUSING,
  RESTING,
}

export class PomodoroServiceClass {
  private PomodoroStatusSubject = new BehaviorSubject<PomodoroStatus>(
    PomodoroStatus.NONE,
  );
  private PomodoroTimeSubject = new BehaviorSubject<number>(0);
  private static instance: PomodoroServiceClass;

  pomodoroStatus$ = this.PomodoroStatusSubject.asObservable().pipe(share());
  pomodoroTime$ = this.PomodoroTimeSubject.asObservable().pipe(share());

  constructor() {
    this.init();
  }

  private init() {
    this.PomodoroStatusSubject.next(PomodoroStatus.NONE);
    this.PomodoroTimeSubject.next(0);
    this.startTimer().subscribe();
  }

  setStatus(status: PomodoroStatus) {
    this.PomodoroStatusSubject.next(status);
    this.PomodoroTimeSubject.next(0);
  }

  public static getInstance(): PomodoroServiceClass {
    if (!PomodoroServiceClass.instance) {
      PomodoroServiceClass.instance = new PomodoroServiceClass();
    }
    return PomodoroServiceClass.instance;
  }

  private startTimer() {
    return interval(1000).pipe(
      tap(() => {
        this.PomodoroTimeSubject.next(this.PomodoroTimeSubject.value + 1000);
      }),
    );
  }
}

export const PomodoroService = PomodoroServiceClass.getInstance();
