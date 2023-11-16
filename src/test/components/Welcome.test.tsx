import React from 'react';
import { Welcome } from '../../components/index';

import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import { usersApi } from '../../shared/apis';

import { mockLocalStorage } from '../../../fixture/mockLocalStorage';

import { act, fireEvent, render, screen } from '@testing-library/react';

const mockWelcome = (func: jest.Mock<any, any>) => {
  mockLocalStorage(func);
  const { container } = render(
    <ThemeProvider theme={designTheme}>
      <Welcome />
    </ThemeProvider>,
  );
  return container;
};

describe('Welcome', () => {
  describe('유저가 로그인을 안했을 경우', () => {
    let renderResult: HTMLElement;

    beforeEach(() => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('id', 'main-container');
      document.body.appendChild(mockElement);
      renderResult = mockWelcome(jest.fn((key: string) => null));
    });

    it('타이틀과 로그인 버튼을 렌더링 하고', () => {
      expect(renderResult).toHaveTextContent('EXTREME TODO');
      expect(renderResult).toContainElement(
        screen.getByAltText('google login button'),
      );
    });

    // TODO : 이 부분은 로그인 로직을 테스트 하는 e2e 테스트 쪽으로 옮겨야 하지 않을까?
    it('로그인 버튼을 눌렀을 때 login메소드를 작동시킨다.', () => {
      const spyOnLogin = jest.spyOn(usersApi, 'login').mockImplementation();
      const googleImage = screen.getByRole('img');
      fireEvent.click(googleImage);
      expect(spyOnLogin).toBeCalled();
    });
  });

  // describe('유저가 로그인 버튼을 눌렀을 때', () => {
  //   it('구글 로그인 페이지로 가야 한다.', async () => {
  //     // const page = await browser.newPage();
  //     await page.goto('http://localhost:3000');
  //     const test = await page.$('span');
  //     expect(test).not.toBeNull();
  //   });
  // });

  describe('유저가 로그인을 했을 경우', () => {
    let renderResult: HTMLElement;

    beforeEach(() => {
      renderResult = mockWelcome(
        jest.fn((key: string) => 'extremeTokemSample'),
      );
    });

    it('로그아웃 버튼이 렌더링 되어야 하고,', () => {
      expect(renderResult).toContainElement(screen.getByText('SIGN OUT'));
    });

    it('클릭하면 removeItem을 호출한다.', () => {
      const spyOnLogout = jest.spyOn(usersApi, 'logout').mockImplementation();
      const logoutBtn = screen.getByText('SIGN OUT');
      fireEvent.click(logoutBtn);
      expect(spyOnLogout).toBeCalled();
    });

    it('셋팅 버튼이 렌더링 되어야 하고,', () => {
      expect(renderResult).toContainElement(screen.getByText('SETTING'));
    });

    it('클릭하면 셋팅 모달을 띄워준다.', () => {
      const settingBtn = screen.getByText('SETTING');

      fireEvent.click(settingBtn);

      act(() => {
        const settingTitle = screen.getByText('설정');
        expect(settingTitle).toBeInTheDocument();
      });
    });
  });
});

/* TODO 로그인 로직 자체는 e2e테스트로 작성을 해야 한다.
[ ]context
  로그인 이미지를 누면 
it
  로그인 url로 넘어간다 or 갔다가 뭘 받아온다
[ ] context
  로그인 과정에서 에러가 발생한다면
it
  에러 메시지를 출력해준다.
*/
