import { render, screen } from '@testing-library/react';
import { Modal, Setting } from '../../components';
import { ThemeProvider } from '@emotion/react';
import { designTheme } from '../../styles/theme';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockLocalStorage } from '../../../fixture/mockLocalStorage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Modal', () => {
  describe('title과 SettingModal을 넘겨주면', () => {
    let renderResult: ReturnType<typeof render>;

    beforeEach(() => {
      mockLocalStorage(
        jest.fn((key: string) => {
          if (key === 'extremeToken' || key === 'extremeEmail')
            return 'whydiditwork';
        }),
        jest.fn((key: string, data: string) => null),
        jest.fn((key: string) => null),
      );
      const mockElement = document.createElement('div');
      mockElement.setAttribute('id', 'main-container');
      document.body.appendChild(mockElement);

      const handleDone = () => {
        console.log('Done');
      };
      const handleClose = () => {
        console.log('Close');
      };
      renderResult = render(
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={designTheme}>
            <Modal title="설정" handleClose={handleClose}>
              <Setting handleClose={handleClose} />
            </Modal>
          </ThemeProvider>
        </QueryClientProvider>,
      );
    });

    it('title과 기본 버튼을 렌더링 해줘야 합니다.', () => {
      const { container } = renderResult;
      expect(container).toContainElement(screen.getByText('설정'));
      expect(container).toContainElement(screen.getByAltText('close'));
    });

    it('셋팅 모달에 있는 버튼을 렌더링 해줘야 합니다.', () => {
      const { container } = renderResult;
      expect(container).toContainElement(screen.getByText('데이터 초기화'));
      expect(container).toContainElement(screen.getByText('회원탈퇴'));
    });
  });
});

/* 

const renderResult = () => {
      const handleDone = () => {
        console.log('Done');
      };
      const handleClose = () => {
        console.log('Close');
      };
      return render(
        <ThemeProvider theme={designTheme}>
          <Modal title="설정" handleDone={handleDone} handleClose={handleClose}>
            <Setting />
          </Modal>
        </ThemeProvider>,
      );
    };
*/
