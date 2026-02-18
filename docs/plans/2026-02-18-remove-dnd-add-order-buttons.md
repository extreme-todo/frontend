# DnD 제거 → 순서 이동 버튼 추가 구현 플랜

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `react-beautiful-dnd`를 제거하고 각 TodoCard 오른쪽에 ▲/▼ 버튼을 추가해 순서를 한 칸씩 이동할 수 있게 한다.

**Architecture:** `TodoList`에서 `moveReorderHandler`를 만들어 기존 `reorderMutate`를 재사용한다. 버튼은 `TodoCard` 오른쪽에 flex column으로 배치한다. `isDragging` prop은 관련 컴포넌트에서 모두 제거한다.

**Tech Stack:** React, TanStack Query, Emotion styled-components

---

## Task 1: `FooterContent` — `isDragging` prop 제거

**Files:**
- Modify: `src/components/TodoCard/content/FooterContent.tsx`

**Step 1: `isDragging` prop 제거**

`IFooterContentProps`에서 `isDragging: boolean | undefined` 삭제.
함수 파라미터에서 `isDragging` 제거.
`if (isDragging || done) return null;` → `if (done) return null;`

```tsx
interface IFooterContentProps {
  // isDragging 줄 삭제
  done: boolean;
  isThisEdit: boolean;
  isCurrTodo: boolean;
  duration: string;
  durationValue: number;
  handleEditButton: () => void;
  setShowTomatoInput: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerElement: React.Dispatch<
    React.SetStateAction<HTMLDivElement | null>
  >;
  isDisabled: boolean;
  isSubmitting: boolean;
}

export const FooterContent = memo(
  ({
    // isDragging 파라미터 줄 삭제
    done,
    ...
  }: IFooterContentProps) => {
    if (done) return null;   // isDragging 조건 제거
    ...
  }
)
```

**Step 2: TypeScript 에러 없는지 확인**

```bash
cd /Users/donggyu/Documents/dev/side/et/frontend && npx tsc --noEmit 2>&1 | head -30
```

---

## Task 2: `TopRightCornerIcon` — `isDragging` prop 제거

**Files:**
- Modify: `src/components/TodoCard/content/TopRightCornerIcon.tsx`

**Step 1: `isDragging` prop 제거**

인터페이스와 파라미터에서 `isDragging` 삭제.
`if (isCurrTodo || done || isDragging) return null;` → `if (isCurrTodo || done) return null;`

```tsx
export const TopRightCornerIcon = memo(
  ({
    isCurrTodo,
    done,
    isThisEdit,
    // isDragging 줄 삭제
    handleEditCancel,
    handleDeleteButton,
  }: {
    isCurrTodo: boolean;
    done: boolean;
    isThisEdit: boolean;
    // isDragging 줄 삭제
    handleEditCancel: () => void;
    handleDeleteButton: () => void;
  }) => {
    if (isCurrTodo || done) return null;   // isDragging 조건 제거
    ...
  }
)
```

**Step 2: TypeScript 에러 없는지 확인**

```bash
npx tsc --noEmit 2>&1 | head -30
```

---

## Task 3: `HandleIconAndOrder` — 드래그 핸들 아이콘 제거, 번호만 표시

**Files:**
- Modify: `src/components/TodoCard/content/HandleIconAndOrder.tsx`

**Step 1: 파일 전체 교체**

`dragHandleProps` 완전히 제거. `done`이면 null, 아니면 순서 번호만 표시.

```tsx
import { memo } from 'react';
import { TypoAtom } from '../../../atoms';

interface IHandleIconAndOrderProps {
  done: boolean;
  order: number;
}

export const HandlerIconAndOrder = memo(
  ({ done, order }: IHandleIconAndOrderProps) => {
    if (done) return null;
    return (
      <TypoAtom fontSize="h3" fontColor="primary2">
        {order}.
      </TypoAtom>
    );
  },
);
```

> **Note:** `isCurrTodo`, `isThisEdit`는 색상 분기에 사용됐으나, 오른쪽 버튼 컬럼으로 로직이 이동하므로 제거. 번호 색상은 기존 `primary2`로 통일.

**Step 2: TypeScript 에러 없는지 확인**

```bash
npx tsc --noEmit 2>&1 | head -30
```

---

## Task 4: `TodoCard/index.tsx` — 레이아웃 변경 및 버튼 컬럼 추가

**Files:**
- Modify: `src/components/TodoCard/index.tsx`

**Step 1: props 인터페이스 업데이트**

```tsx
interface ITodoCardProps {
  todoData: TodoEntity;
  // dragHandleProps 제거
  // snapshot 제거
  focusStep: focusStep;
  randomTagColor: RandomTagColorList;
  isExtreme: boolean;
  isCurrTodo: boolean;
  order: number;
  isThisEdit: boolean;
  setEditTodoId: React.Dispatch<React.SetStateAction<string | undefined>>;
  onMoveUp?: () => void;    // 신규
  onMoveDown?: () => void;  // 신규
  isFirst?: boolean;        // 신규
  isLast?: boolean;         // 신규
}
```

**Step 2: import 정리**

제거:
```tsx
// 제거
import {
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
```

**Step 3: 컴포넌트 파라미터 업데이트**

```tsx
export const TodoCard = ({
  todoData,
  // dragHandleProps, snapshot 제거
  focusStep,
  randomTagColor,
  isCurrTodo,
  order,
  isThisEdit,
  setEditTodoId,
  isExtreme,
  onMoveUp,   // 신규
  onMoveDown, // 신규
  isFirst,    // 신규
  isLast,     // 신규
}: ITodoCardProps) => {
```

**Step 4: `HandlerIconAndOrder` 호출 업데이트**

```tsx
<HandlerIconAndOrder
  done={done}
  order={order}
  // isCurrTodo, isThisEdit, dragHandleProps 제거
/>
```

**Step 5: `FooterContent`, `TopRightCornerIcon` 호출에서 `isDragging` 제거**

```tsx
<TopRightCornerIcon
  isCurrTodo={isCurrTodo}
  done={done}
  isThisEdit={isThisEdit}
  // isDragging={snapshot?.isDragging}  제거
  handleEditCancel={handleEditCancel}
  handleDeleteButton={handleDeleteButton}
/>
```

```tsx
<FooterContent
  // isDragging={snapshot?.isDragging}  제거
  done={done}
  isThisEdit={isThisEdit}
  ...
/>
```

**Step 6: 레이아웃 재구성 — 오른쪽 버튼 컬럼 추가**

`TodoCardContainer`의 flex-direction을 row로 변경하고, 기존 내용을 `MainContent`로 감싸고, 오른쪽에 `OrderButtonsColumn` 추가.

```tsx
return (
  <TodoCardContainer
    isExtreme={isExtreme}
    as={isThisEdit ? 'form' : 'div'}
    done={done}
    isCurrTodo={isCurrTodo}
    isThisEdit={isThisEdit}
    onSubmit={handleEditSubmit}
  >
    <MainContent>
      <TitleContainer>
        ...기존 내용...
      </TitleContainer>
      <CategoryContent ... />
      <FooterContent ... />
    </MainContent>
    {!done && (
      <OrderButtonsColumn>
        <OrderBtn
          onClick={onMoveUp}
          disabled={isFirst || isCurrTodo || !onMoveUp}
          aria-label="move up"
        >
          ▲
        </OrderBtn>
        <OrderBtn
          onClick={onMoveDown}
          disabled={isLast || isCurrTodo || !onMoveDown}
          aria-label="move down"
        >
          ▼
        </OrderBtn>
      </OrderButtonsColumn>
    )}
  </TodoCardContainer>
);
```

**Step 7: styled-components 업데이트**

`TodoCardContainer`를 row 레이아웃으로 변경, `MainContent`와 `OrderButtonsColumn` 스타일 추가.

```tsx
const TodoCardContainer = styled.div<{...}>`
  display: flex;
  flex-direction: row;   // column → row
  align-items: stretch;
  ...기존 나머지 스타일 유지...
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

const OrderButtonsColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const OrderBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.backgroundColor.primary2};
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  line-height: 1;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.7;
  }
`;
```

**Step 8: TypeScript 에러 없는지 확인**

```bash
npx tsc --noEmit 2>&1 | head -30
```

---

## Task 5: `TodoList/index.tsx` — DnD 제거 및 버튼 핸들러 추가

**Files:**
- Modify: `src/components/TodoList/index.tsx`

**Step 1: DnD import 제거**

```tsx
// 아래 블록 전체 제거
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  useMouseSensor,
} from 'react-beautiful-dnd';
```

**Step 2: 불필요한 hook import 제거**

```tsx
import {
  // useDraggableInPortal 제거
  useEdit,
  type focusStep,
  // useTouchSensor 제거
  useIsMobile,
  useExtremeMode,
} from '../../hooks';
```

**Step 3: `dragHelper` import 제거**

```tsx
// 제거
import { onDragDropHandler } from './dragHelper';
```

**Step 4: `moveReorderHandler` 추가**

`handleDragEnd` 제거하고 아래로 교체:

```tsx
const moveReorderHandler = useCallback(
  (todo: TodoEntity, direction: 'up' | 'down') => {
    if (!todos) return;
    const copyMapTodo = new Map(todos);
    const dateKey = Array.from(copyMapTodo.keys())[0];
    const copyTodo = (copyMapTodo.get(dateKey) ?? []).slice();
    const idx = copyTodo.findIndex((t) => t.id === todo.id);
    if (idx === -1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= copyTodo.length) return;

    const prevOrder = todo.order as number;
    const newOrder = copyTodo[swapIdx].order as number;

    [copyTodo[idx], copyTodo[swapIdx]] = [copyTodo[swapIdx], copyTodo[idx]];
    copyMapTodo.set(dateKey, copyTodo);

    reorderMutate({ prevOrder, newOrder, todolist: copyMapTodo });
  },
  [todos, reorderMutate],
);
```

**Step 5: `droppableId` useMemo 제거**

```tsx
// 제거
const droppableId = useMemo(
  () =>
    (todos && Array.from(todos.keys())[0]) ?? getDateInFormat(new Date()),
  [todos],
);
```

**Step 6: `optionalPortal` 제거**

```tsx
// 제거
const optionalPortal = useDraggableInPortal();
```

**Step 7: draggable 목록 렌더 JSX 교체**

현재 (DnD 버전):
```tsx
<DragDropContext ...>
  <Droppable droppableId={droppableId}>
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef} className="innerList">
        {todoList.map(
          (todo, idx) =>
            todo.id !== currentTodo?.id && (
              <Draggable draggableId={String(todo.id)} index={idx} key={todo.id}>
                {optionalPortal((provided, snapshot) => (
                  <li {...provided.draggableProps} ref={provided.innerRef}>
                    <MemoTodoCard
                      ...
                      dragHandleProps={provided.dragHandleProps}
                      snapshot={snapshot}
                      ...
                    />
                  </li>
                ))}
              </Draggable>
            ),
        )}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

교체 후 (버튼 버전):
```tsx
<div className="innerList">
  {(() => {
    const filteredList = todoList.filter(
      (todo) => todo.id !== currentTodo?.id,
    );
    return filteredList.map((todo, idx) => (
      <li key={todo.id}>
        <MemoTodoCard
          isThisEdit={editTodoId === todo.id}
          setEditTodoId={setEditTodoId}
          todoData={todo}
          focusStep={focusStep}
          randomTagColor={randomTagColor}
          isCurrTodo={false}
          order={idx + 1 + (doneTodos ? doneTodos.size : 0)}
          isExtreme={isExtreme}
          onMoveUp={() => moveReorderHandler(todo, 'up')}
          onMoveDown={() => moveReorderHandler(todo, 'down')}
          isFirst={idx === 0}
          isLast={idx === filteredList.length - 1}
        />
      </li>
    ));
  })()}
</div>
```

**Step 8: currentTodo 렌더링에도 isCurrTodo 버튼 props 추가**

```tsx
<MemoTodoCard
  isThisEdit={editTodoId === currentTodo.id}
  setEditTodoId={setEditTodoId}
  todoData={currentTodo}
  focusStep={focusStep}
  randomTagColor={randomTagColor}
  isCurrTodo={true}
  order={(doneTodoList?.length ?? 0) + 1}
  isExtreme={isExtreme}
  // currentTodo는 onMoveUp/onMoveDown 없이 전달 → 버튼 disabled
  isFirst={false}
  isLast={false}
/>
```

**Step 9: unused import 정리**

`getDateInFormat`가 더 이상 사용되지 않으면 제거.

**Step 10: TypeScript 에러 없는지 확인**

```bash
npx tsc --noEmit 2>&1 | head -30
```

---

## Task 6: 불필요한 파일 및 hook export 제거

**Files:**
- Delete: `src/components/TodoList/dragHelper.ts`
- Modify: `src/hooks/index.ts`

**Step 1: `dragHelper.ts` 삭제**

```bash
rm src/components/TodoList/dragHelper.ts
```

**Step 2: `hooks/index.ts`에서 export 제거**

```tsx
// 아래 두 줄 제거
export { useDraggableInPortal } from './useDraggableInPortal';
export { useTouchSensor } from './useTouchSensor';
```

**Step 3: 최종 TypeScript 체크**

```bash
npx tsc --noEmit 2>&1
```

에러 없으면 완료.

---

## Task 7: 브라우저 동작 확인 및 커밋

**Step 1: 개발 서버 실행**

```bash
npm run dev
```

**Step 2: 체크리스트**

- [ ] TodoCard에 ▲/▼ 버튼이 오른쪽에 표시되는가
- [ ] 첫 번째 아이템의 ▲ 버튼이 비활성(흐릿)인가
- [ ] 마지막 아이템의 ▼ 버튼이 비활성(흐릿)인가
- [ ] 버튼 클릭 시 순서가 변경되는가 (Optimistic update 포함)
- [ ] currentTodo의 ▲/▼ 버튼이 모두 비활성인가
- [ ] 완료된 Todo에는 버튼이 없는가
- [ ] 왼쪽 드래그 핸들 아이콘이 사라지고 번호만 남았는가
- [ ] 콘솔 에러 없는가

**Step 3: 커밋**

```bash
git add \
  src/components/TodoList/index.tsx \
  src/components/TodoCard/index.tsx \
  src/components/TodoCard/content/HandleIconAndOrder.tsx \
  src/components/TodoCard/content/FooterContent.tsx \
  src/components/TodoCard/content/TopRightCornerIcon.tsx \
  src/hooks/index.ts \
  docs/plans/

git commit -m "feat: #255 DnD 제거, TodoCard 순서 이동 버튼(▲/▼) 추가"
```
