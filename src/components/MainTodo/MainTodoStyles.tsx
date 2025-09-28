import styled from '@emotion/styled';

export const MainTodoContainer = styled.main`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const MainTodoContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4rem;
  width: 100%;
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    width: 100%;
    height: 100%;
  }
`;

export const MainTodoCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  .side-buttons {
    width: 59rem;
    > div {
      display: flex;
      gap: 0.75rem;
    }
  }
  .center {
    width: 59rem;
    height: 28.75rem;
    position: relative;
    > * {
      position: absolute;
    }
  }
  .tag-button {
    border: 1px solid ${({ theme }) => theme.color.primary.primary1};
    border-radius: 1.25rem;
    height: 1.25rem;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.primary.primary1};
    &.extreme {
      color: ${({ theme }) => {
        return theme.color.fontColor.extreme_orange;
      }};
      border-color: ${({ theme }) => {
        return theme.color.fontColor.extreme_orange;
      }};
    }
  }
  @media ${({ theme }) => theme.responsiveDevice.tablet_v},
    ${({ theme }) => theme.responsiveDevice.mobile} {
    gap: 0.5rem;
    .center {
      width: 89.9%;
      height: calc(100vh - 13.25rem);
    }
    .side-buttons {
      width: 89.9%;
      position: relative;
    }
    .time-setting {
      position: absolute;
      left: 1.25rem;
      top: 3.5rem;
      z-index: 5;
    }
  }
`;

export const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
