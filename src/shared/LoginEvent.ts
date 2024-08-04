export default class LoginEvent {
  private static instance: LoginEvent;
  private event: Event;

  private constructor() {
    this.event = new Event('loginevent');
  }

  public static getInstance(): LoginEvent {
    if (!LoginEvent.instance) {
      LoginEvent.instance = new LoginEvent();
    }
    return LoginEvent.instance;
  }

  public getEvent(): Event {
    return this.event;
  }
}
