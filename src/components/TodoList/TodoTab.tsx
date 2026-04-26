import styled from '@emotion/styled';
import { TypoAtom } from '../../atoms';

interface ITodoTabProps {
  activeTab: 'todo' | 'done';
  setActiveTab: (tab: 'todo' | 'done') => void;
  isExtreme?: boolean;
  todoCount?: number;
  doneCount?: number;
}

export const TodoTab = ({
  activeTab,
  setActiveTab,
  isExtreme,
  todoCount = 0,
  doneCount = 0,
}: ITodoTabProps) => {
  return (
    <TabContainer role="tablist" isExtreme={isExtreme}>
      <TabButton
        role="tab"
        aria-selected={activeTab === 'todo'}
        aria-controls="todo-tabpanel"
        id="todo-tab"
        active={activeTab === 'todo'}
        onClick={() => setActiveTab('todo')}
        isExtreme={isExtreme}
      >
        <TabText
          fontSize="h3"
          fontColor={
            activeTab === 'todo'
              ? isExtreme
                ? 'extreme_dark'
                : 'primary1'
              : 'primary2'
          }
          active={activeTab === 'todo'}
        >
          남은 TODO: {todoCount}
        </TabText>
      </TabButton>
      <TabButton
        role="tab"
        aria-selected={activeTab === 'done'}
        aria-controls="done-tabpanel"
        id="done-tab"
        active={activeTab === 'done'}
        onClick={() => setActiveTab('done')}
        isExtreme={isExtreme}
      >
        <TabText
          fontSize="h3"
          fontColor={
            activeTab === 'done'
              ? isExtreme
                ? 'extreme_dark'
                : 'primary1'
              : 'primary2'
          }
          active={activeTab === 'done'}
        >
          완료한 TODO: {doneCount}
        </TabText>
      </TabButton>
    </TabContainer>
  );
};

const TabContainer = styled.div<{ isExtreme?: boolean }>`
  display: flex;
  width: 100%;
  padding: 4px;
  background-color: ${({ isExtreme }) =>
    isExtreme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
`;

const TabButton = styled.button<{ active: boolean; isExtreme?: boolean }>`
  flex: 1;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: ${({ active, theme }) =>
    active ? theme.color.backgroundColor.primary2 : 'transparent'};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ active, theme }) =>
      active
        ? theme.color.backgroundColor.primary2
        : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const TabText = styled(TypoAtom)<{ active: boolean }>`
  font-weight: ${({ active }) => (active ? 700 : 400)};
`;
