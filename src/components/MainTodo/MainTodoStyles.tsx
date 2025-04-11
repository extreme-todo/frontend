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
  gap: 0.75rem;
  .center {
    width: 53.75rem;
    height: 20rem;
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
    width: 100%;
    height: 100%;
    padding: 24rem 4rem 4rem 4rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 0px;
    box-sizing: border-box;
    row-gap: 0;
    > :nth-child(2) {
      grid-column: 1 / span 2;
    }
    > :nth-child(1),
    > :nth-child(3) {
      margin-top: -12rem;
      z-index: 5;
      /* position: absolute;
      bottom: 0; */
    }
    > :nth-child(1) {
      justify-content: flex-start;
    }
    > :nth-child(3) {
      justify-content: flex-end;
    }
  }
`;
