import styled from '@emotion/styled';

export const TodoProgressBarAtom = styled.div<{
  progress: number;
  type: 'primary1' | 'primary2' | 'extreme1' | 'extreme2';
}>`
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'primary1':
        return theme.color.backgroundColor.primary1;
      case 'primary2':
        return theme.color.backgroundColor.primary2;
      case 'extreme1':
        return theme.color.backgroundColor.extreme_dark;
      case 'extreme2':
        return theme.color.backgroundColor.extreme_orange;
    }
  }};
  height: 0.75rem;
  width: 100%;
  border-radius: 1.75rem;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  .progress {
    width: ${({ progress }) => `${progress}%`};
    height: 100%;
    line-height: 2.875rem;
    border-radius: 3.125rem;
    background: ${({ theme }) => theme.color.backgroundColor.extreme_orange};
    transition: all 0.2s ease-in-out;
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
    padding: 1rem 0 1rem 0;
    .progress {
      height: ${({ progress }) => `${progress}%`};
      width: 70%;
      overflow: hidden;
      padding: 0;
      color: transparent;
    }
  }
`;
