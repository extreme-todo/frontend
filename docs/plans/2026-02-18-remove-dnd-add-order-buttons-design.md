# Design: DnD 제거 → 순서 이동 버튼 추가

**날짜**: 2026-02-18
**브랜치**: `255-remove-dnd`
**관련 이슈**: #255

---

## 배경

현재 `react-beautiful-dnd`를 사용해 Todo 카드를 드래그 앤 드롭으로 순서 변경할 수 있다.
이를 제거하고 각 카드 오른쪽에 ▲ / ▼ 버튼을 추가해 한 칸씩 순서를 이동할 수 있게 한다.

---

## 목표 UI

```
┌──────────────────────────────────┬───┐
│ 1.  제목을 입력해주세요.          │ ▲ │
│                                  │   │
│  [공부 ×]  [개발 ×]  [태그 추가] │   │
│                                  │   │
│  🍅 4 Round ∨     1시간 40분     │ ▼ │
└──────────────────────────────────┴───┘
```

- 오른쪽 세로 스트립에 ▲ / ▼ 버튼 배치
- 왼쪽: 드래그 핸들 아이콘 제거, **순서 번호만 유지** (예: `1.`)
- 버튼 아이콘: 유니코드 문자 `▲` / `▼`

---

## 상태별 버튼 동작

| 상태 | ▲ / ▼ 버튼 |
|------|-----------|
| 일반 Todo | 표시, 활성 |
| 첫 번째 아이템 | ▲ disabled |
| 마지막 아이템 | ▼ disabled |
| `currentTodo` (진행 중) | 표시, **전부 disabled** |
| `done` (완료) | **컬럼 미표시** |

---

## 컴포넌트 레이아웃

```
TodoCardContainer  (flex-direction: row)
├── MainContent  (flex: 1)          ← 기존 내용 전체
│   ├── TitleContainer
│   │   ├── HandlerIconAndOrder     ← 드래그 핸들 아이콘 제거, 번호만 표시
│   │   ├── TitleOrInput
│   │   └── TopRightCornerIcon
│   ├── CategoryContent
│   └── FooterContent
└── OrderButtonsColumn              ← 신규 (done이면 미렌더)
    ├── ▲ 버튼
    └── ▼ 버튼
```

---

## Props 흐름

```
TodoList
│
├── moveReorderHandler(todo, 'up' | 'down')
│     └── 기존 reorderMutate({ prevOrder, newOrder, todolist }) 재사용
│
└── TodoCard
      ├── onMoveUp: (todo: TodoEntity) => void
      ├── onMoveDown: (todo: TodoEntity) => void
      ├── isFirst: boolean
      └── isLast: boolean
```

`isFirst` / `isLast`는 `TodoList`에서 렌더링 시 `idx` 기준으로 계산
(currentTodo가 필터링된 배열 기준).

---

## 접근 방식 비교

| 방식 | 설명 | 선택 여부 |
|------|------|----------|
| **A. TodoCard 내 버튼 컬럼 직접 추가** | 레이아웃을 row로 변경, 오른쪽에 버튼 컬럼 인라인 렌더 | ✅ **채택** |
| B. 별도 `OrderButtons` 컴포넌트 분리 | `content/OrderButtons.tsx` 신규 파일 추출 | — (불필요한 추상화) |
| C. HandlerIconAndOrder 내부에 통합 | 왼쪽 핸들러 영역에 버튼 배치 | — (UI 스펙과 불일치) |

---

## 변경 파일 목록

### 수정

| 파일 | 변경 내용 |
|------|----------|
| `src/components/TodoList/index.tsx` | DnD 제거, `moveReorderHandler` 추가, `TodoCard`에 새 props 전달 |
| `src/components/TodoCard/index.tsx` | `dragHandleProps`/`snapshot` 제거, `onMoveUp`/`onMoveDown`/`isFirst`/`isLast` 추가, 오른쪽 버튼 컬럼 렌더링 |
| `src/components/TodoCard/content/HandleIconAndOrder.tsx` | 드래그 핸들 아이콘 제거, 번호만 표시 |
| `src/hooks/index.ts` | `useDraggableInPortal`, `useTouchSensor` export 제거 |

### 삭제

| 파일 | 이유 |
|------|------|
| `src/components/TodoList/dragHelper.ts` | DnD 전용 로직, 더 이상 불필요 |

---

## 재사용되는 기존 로직

- **`todosApi.reorderTodos(prevOrder, newOrder)`** — API 호출 구조 그대로 유지
- **`reorderMutate({ prevOrder, newOrder, todolist })`** — Optimistic update + 서버 동기화 mutation 그대로 재사용
- **`todo.order`** 필드 — 버튼 클릭 시 `prevOrder = todo.order`, `newOrder = adjacentTodo.order`

---

## 제거되는 라이브러리 의존

- `react-beautiful-dnd` — `DragDropContext`, `Draggable`, `Droppable`, `DropResult`, `useMouseSensor`
- `useTouchSensor` (커스텀 훅)
- `useDraggableInPortal` (커스텀 훅)

> `react-beautiful-dnd` 패키지 자체를 `package.json`에서 제거할지는 구현 시 확인.
