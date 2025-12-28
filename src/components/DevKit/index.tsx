import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import { PomodoroDevKit } from './PomodoroDevKit';
import { CurrentTodoDevKit } from './CurrentTodoDevKit';

export const DevKit = () => {
  const [collapse, setCollapse] = useState(false);
  const devKitTabs = ['pomodoro', 'currentTodo'] as const;
  type DevKitTab = (typeof devKitTabs)[number];
  const [tab, setTab] = useState<DevKitTab>('pomodoro');

  const currentTabContent = useMemo(() => {
    switch (tab) {
      case 'pomodoro':
        return <PomodoroDevKit />;
      case 'currentTodo':
        return <CurrentTodoDevKit />;
      default:
        return null;
    }
  }, [tab]);

  return process.env.NODE_ENV === 'development' ? (
    <DevKitContainer>
      <div
        className="devkit-button"
        onClick={() => setCollapse((prev) => !prev)}
      >
        {collapse ? 'Show' : 'Hide'} 🍅Devkit
      </div>
      {collapse ? null : (
        <div className="tabs">
          {devKitTabs.map((devKitTab) => (
            <button
              key={devKitTab}
              className="devkit-button"
              style={{
                fontWeight: tab === devKitTab ? 'bold' : 'normal',
                backgroundColor:
                  tab === devKitTab ? '#ffffff80' : 'transparent',
              }}
              onClick={() => setTab(devKitTab)}
            >
              {devKitTab}
            </button>
          ))}
        </div>
      )}
      {collapse ? null : <div className="tab-content">{currentTabContent}</div>}
    </DevKitContainer>
  ) : null;
};

const DevKitContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  background-color: #00000010;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 8px;
  color: black;
  font-size: 14px;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5);

  .devkit-button {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    border: 1px solid white;
    user-select: none;
    color: black;
    text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5);
    box-shadow: inset 0 8px 4px #ffffff80;
    &:hover {
      background-color: #00000020;
    }
  }

  .tabs {
    display: flex;
    gap: 4px;
    border-bottom: 2px solid #ffffff80;
    color: white;
    > button {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
    }
  }

  .tab-content {
    pre {
      margin: 0;
    }
  }
`;
