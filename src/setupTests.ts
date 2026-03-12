// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { PomodoroService } from './services/PomodoroService';

// 테스트 종료 후 타이머 해제
afterAll(() => {
  PomodoroService.dispose();
});
