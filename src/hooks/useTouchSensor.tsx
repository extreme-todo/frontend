import * as React from 'react';
import { useCallback, useMemo } from 'use-memo-one';
import type { Position } from 'css-box-model';
import {
  DraggableId,
  FluidDragActions,
  PreDragActions,
  SensorAPI,
} from 'react-beautiful-dnd';

type TouchWithForce = Touch & {
  force: number;
};

type Idle = {
  type: 'IDLE';
};

type Pending = {
  type: 'PENDING';
  point: Position;
  actions: PreDragActions;
  longPressTimerId: NodeJS.Timeout;
};

type Dragging = {
  type: 'DRAGGING';
  actions: FluidDragActions;
  hasMoved: boolean;
};

type Phase = Idle | Pending | Dragging;

type PredicateFn<T> = (value: T) => boolean;

/**
 * findIndex와 find는 배열 오브젝트에 있는 동명의 메소드 역할을 한다.
 */
function findIndex<T>(list: T[], predicate: PredicateFn<T>): number {
  if (list.findIndex) {
    return list.findIndex(predicate);
  }

  // Using a for loop so that we can exit early
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return i;
    }
  }
  // Array.prototype.find returns -1 when nothing is found
  return -1;
}

function find<T>(list: T[], predicate: PredicateFn<T>): T | undefined {
  if (list.find) {
    return list.find(predicate);
  }
  const index: number = findIndex(list, predicate);
  if (index !== -1) {
    return list[index];
  }
  // Array.prototype.find returns undefined when nothing is found
  return undefined;
}

/**
 * 브라우저 종류에 따라 프로퍼티 명칭이 다른 visibilitychange 이벤트를 document에서 찾아서 리턴해준다.
 */
const supportedPageVisibilityEventName: string = ((): string => {
  const base = 'visibilitychange';

  // Server side rendering
  if (typeof document === 'undefined') {
    return base;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  const candidates: string[] = [
    base,
    `ms${base}`,
    `webkit${base}`,
    `moz${base}`,
    `o${base}`,
  ];

  const supported: string | undefined = find(
    candidates,
    (eventName: string): boolean => `on${eventName}` in document,
  );

  return supported || base;
})();

const idle: Idle = { type: 'IDLE' };
// Decreased from 150 as a work around for an issue for forcepress on iOS
// https://github.com/atlassian/react-beautiful-dnd/issues/1401
export const timeForLongPress = 120;
export const forcePressThreshold = 0.15;

type GetBindingArgs = {
  cancel: () => void;
  completed: () => void;
  getPhase: () => Phase;
};

/**
 * GetBindingArgs 타입의 인자를 받아서 특정 이벤트에 콜백을 바인딩하는 함수.
 * 이벤트와 콜백을 가지고 있는 객체 배열을 반환한다.
 */
function getWindowBindings({
  cancel,
  getPhase,
}: GetBindingArgs): EventBinding[] {
  return [
    // If the orientation of the device changes - kill the drag
    // https://davidwalsh.name/orientation-change
    {
      eventName: 'orientationchange' as keyof HTMLElementEventMap,
      fn: cancel,
    },
    // some devices fire resize if the orientation changes
    {
      eventName: 'resize',
      fn: cancel,
    },
    // Long press can bring up a context menu
    // need to opt out of this behavior
    {
      eventName: 'contextmenu',
      fn: (event: Event) => {
        // always opting out of context menu events
        event.preventDefault();
      },
    },
    // On some devices it is possible to have a touch interface with a keyboard.
    // On any keyboard event we cancel a touch drag
    {
      eventName: 'keydown',
      fn: (event: KeyboardEvent) => {
        if (getPhase().type !== 'DRAGGING') {
          cancel();
          return;
        }

        // direct cancel: we are preventing the default action
        // indirect cancel: we are not preventing the default action

        // escape is a direct cancel
        if (event.key === 'Escape') {
          event.preventDefault();
        }
        cancel();
      },
    },
    // Cancel on page visibility change
    {
      eventName: supportedPageVisibilityEventName as keyof HTMLElementEventMap,
      fn: cancel,
    },
  ];
}

// All of the touch events get applied to the drag handle of the touch interaction
// This plays well with the event.target being unmounted during a drag
function getHandleBindings({
  cancel,
  completed,
  getPhase,
}: GetBindingArgs): EventBinding[] {
  return [
    {
      eventName: 'touchmove',
      // Opting out of passive touchmove (default) so as to prevent scrolling while moving
      // Not worried about performance as effect of move is throttled in requestAnimationFrame
      // Using `capture: false` due to a recent horrible firefox bug: https://twitter.com/alexandereardon/status/1125904207184187393
      options: { capture: false },
      fn: (event: TouchEvent) => {
        const phase: Phase = getPhase();
        // Drag has not yet started and we are waiting for a long press.
        if (phase.type !== 'DRAGGING') {
          cancel();
          return;
        }

        // At this point we are dragging
        phase.hasMoved = true;

        const { clientX, clientY } = event.touches[0];

        const point: Position = {
          x: clientX,
          y: clientY,
        };

        // We need to prevent the default event in order to block native scrolling
        // Also because we are using it as part of a drag we prevent the default action
        // as a sign that we are using the event
        event.preventDefault();
        phase.actions.move(point);
      },
    },
    {
      eventName: 'touchend',
      fn: (event: TouchEvent) => {
        const phase: Phase = getPhase();
        // drag had not started yet - do not prevent the default action
        if (phase.type !== 'DRAGGING') {
          cancel();
          return;
        }

        // ending the drag
        event.preventDefault();
        phase.actions.drop({ shouldBlockNextClick: true });
        completed();
      },
    },
    {
      eventName: 'touchcancel',
      fn: (event: TouchEvent) => {
        // drag had not started yet - do not prevent the default action
        if (getPhase().type !== 'DRAGGING') {
          cancel();
          return;
        }

        // already dragging - this event is directly ending a drag
        event.preventDefault();
        cancel();
      },
    },
    // Need to opt out of dragging if the user is a force press
    // Only for webkit which has decided to introduce its own custom way of doing things
    // https://developer.apple.com/library/content/documentation/AppleApplications/Conceptual/SafariJSProgTopics/RespondingtoForceTouchEventsfromJavaScript.html
    {
      eventName: 'touchforcechange' as keyof HTMLElementEventMap,
      fn: (event: TouchEvent) => {
        const phase: Phase = getPhase();

        // needed to use phase.actions
        if (phase.type === 'IDLE') {
          throw Error('invariant');
        }

        // This is not fantastic logic, but it is done to account for
        // and issue with forcepress on iOS
        // Calling event.preventDefault() will currently opt out of scrolling and clicking
        // https://github.com/atlassian/react-beautiful-dnd/issues/1401

        const touch: TouchWithForce = event.touches[0] as TouchWithForce;

        if (!touch) {
          return;
        }

        const isForcePress: boolean = touch.force >= forcePressThreshold;

        if (!isForcePress) {
          return;
        }

        const shouldRespect: boolean = phase.actions.shouldRespectForcePress();

        if (phase.type === 'PENDING') {
          if (shouldRespect) {
            cancel();
          }
          // If not respecting we just let the event go through
          // It will not have an impact on the browser until
          // there has been a sufficient time ellapsed
          return;
        }

        // 'DRAGGING'

        if (shouldRespect) {
          if (phase.hasMoved) {
            // After the user has moved we do not allow the dragging item to be force pressed
            // This prevents strange behaviour such as a link preview opening mid drag
            event.preventDefault();
            return;
          }
          // indirect cancel
          cancel();
          return;
        }

        // not respecting during a drag
        event.preventDefault();
      },
    },
    // Cancel on page visibility change
    {
      eventName: supportedPageVisibilityEventName as keyof HTMLElementEventMap,
      fn: cancel,
    },
    // Not adding a cancel on touchstart as this handler will pick up the initial touchstart event
  ];
}
type EventOptions = {
  passive?: boolean;
  capture?: boolean;
  // sometimes an event might only event want to be bound once
  once?: boolean;
};

type NewType = (
  event: KeyboardEvent & TouchEvent & EventListenerOrEventListenerObject,
) => void;

type EventBinding = {
  eventName: keyof HTMLElementEventMap;
  fn: NewType;
  options?: EventOptions;
};

function getOptions(
  shared?: EventOptions,
  fromBinding?: EventOptions,
): EventOptions {
  return {
    ...shared,
    ...fromBinding,
  };
}

type UnbindFn = () => void;

/**
 *
 * @param el
 * @param bindings
 * @param sharedOptions
 *
 * @returns 내부에서 이벤트를 등록하고 해제하는 함수를 배열로 모아서 이를 실행하는 함수를 return
 */
function bindEvents(
  el: HTMLElement | Window,
  bindings: EventBinding[],
  sharedOptions?: EventOptions,
) {
  /**
   * 이벤트 등록하고 해제 함수를 배열로 받음
   * */
  const unbindings: UnbindFn[] = bindings.map(
    (binding: EventBinding): UnbindFn => {
      const options = getOptions(sharedOptions, binding.options);

      el.addEventListener(
        binding.eventName,
        binding.fn as EventListenerOrEventListenerObject,
        options,
      );

      return function unbind() {
        el.removeEventListener(
          binding.eventName,
          binding.fn as EventListenerOrEventListenerObject,
          options,
        );
      };
    },
  );

  // Return a function to unbind events
  return function unbindAll() {
    unbindings.forEach((unbind: UnbindFn) => {
      unbind();
    });
  };
}

/**
 *
 * @param api RBD는 dnd에 사용되는 sensor의 콜백 api를 커스텀 할 수 있다.
 *
 */
export default function useTouchSensor(api: SensorAPI) {
  const phaseRef = React.useRef<Phase>(idle);
  /**
   * bindEvents 함수를 호출하고서 반환되는 이벤트 해제 콜백을 담는 ref
   */
  const unbindEventsRef = React.useRef<() => void>(() => null);

  const getPhase = useCallback(function getPhase(): Phase {
    return phaseRef.current;
  }, []);

  const setPhase = useCallback(function setPhase(phase: Phase) {
    phaseRef.current = phase;
  }, []);

  /**
   * touchstart 이벤트에 대한 바인딩 객체.
   * 추후 bindEvents 함수를 사용해서 이벤트를 등록한다.
   */
  const startCaptureBinding = useMemo(
    () => ({
      eventName: 'touchstart' as keyof HTMLElementEventMap,
      fn: function onTouchStart(event: TouchEvent) {
        // Event already used by something else
        if (event.defaultPrevented) {
          return;
        }

        // We need to NOT call event.preventDefault() so as to maintain as much standard
        // browser interactions as possible.
        // This includes navigation on anchors which we want to preserve

        const draggableId: DraggableId | null =
          api.findClosestDraggableId(event);

        if (!draggableId) {
          return;
        }

        const actions: PreDragActions | null = api.tryGetLock(
          draggableId,
          // eslint-disable-next-line no-use-before-define
          stop,
          { sourceEvent: event },
        );

        // could not start a drag
        if (!actions) {
          return;
        }

        const touch: Touch = event.touches[0];
        const { clientX, clientY } = touch;
        const point: Position = {
          x: clientX,
          y: clientY,
        };
        const dragHandleId = api.findClosestDraggableId(event);
        if (!dragHandleId) {
          throw Error('Touch sensor unable to find drag dragHandleId');
        }
        const handle: HTMLElement | null = document.querySelector(
          `[data-rbd-drag-handle-draggable-id='${dragHandleId}']`,
        );
        if (!handle) {
          throw Error('Touch sensor unable to find drag handle');
        }

        // unbind this event handler
        unbindEventsRef.current();

        // eslint-disable-next-line no-use-before-define
        startPendingDrag(actions, point, handle);
      },
    }),
    // not including stop or startPendingDrag as it is not defined initially
    [api],
  );

  /**
   * 이벤트 캡쳐링 단계에 리스너를 등록한다.
   */
  const listenForCapture = useCallback(
    function listenForCapture() {
      const options = {
        capture: true,
        passive: false,
      };

      unbindEventsRef.current = bindEvents(
        window,
        [startCaptureBinding],
        options,
      );
    },
    [startCaptureBinding],
  );

  /**
   * pending과 dragging 단계에서 동작한다.
   * pending이면 longPressTimerId만큼의 시간이 지나 작동되기로 setTimeout된 startDragging 콜백을 clear해준다.
   * unbinding 후에도 touchstart를 감지할 수 있도록 다시 이벤트를 등록해 준다.
   */
  const stop = useCallback(() => {
    const { current } = phaseRef;
    if (current.type === 'IDLE') {
      return;
    }

    // aborting any pending drag
    if (current.type === 'PENDING') {
      clearTimeout(current.longPressTimerId);
    }

    setPhase(idle);
    unbindEventsRef.current();

    // unbinding 후에도 touchstart를 감지할 수 있도록 이벤트 등록
    listenForCapture();
  }, [listenForCapture, setPhase]);

  /**
   * Dragging과 Pending 단계에서 사용가능하다.
   */
  const cancel = useCallback(() => {
    const phase: Phase = phaseRef.current;
    stop();
    if (phase.type === 'DRAGGING') {
      phase.actions.cancel({ shouldBlockNextClick: true });
    }
    if (phase.type === 'PENDING') {
      phase.actions.abort();
    }
  }, [stop]);

  /**
   * target과 window 이벤트를 바인딩 한다.
   * target에 터치 이벤트를 직접 붙이고 window에도 터치와 기타 이벤트를 붙인다.
   * 그리고 unbindEventsRef에 unbind 콜백을 할당한다.
   */
  const bindCapturingEvents = useCallback(
    function bindCapturingEvents(target: HTMLElement) {
      const options = { capture: true, passive: false };
      const args: GetBindingArgs = {
        cancel,
        completed: stop,
        getPhase,
      };

      // In prior versions of iOS it was required that touch listeners be added
      // to the handle to work correctly (even if the handle got removed in a portal / clone)
      // In the latest version it appears to be the opposite: for reparenting to work
      // the events need to be attached to the window.
      // For now i'll keep these two functions seperate in case we need to swap it back again
      // Old behaviour:
      // https://gist.github.com/parris/dda613e3ae78f14eb2dc9fa0f4bfce3d
      // https://stackoverflow.com/questions/33298828/touch-move-event-dont-fire-after-touch-start-target-is-removed

      // 원본 use touch sensor과 다른 부분이 unbindTarget 부분이다. 원본에는 target에 window가 들어가 있다. target에 직접 이벤트를 등록한다.
      const unbindTarget = bindEvents(target, getHandleBindings(args), options);
      const unbindTargetWindow = bindEvents(
        window,
        getHandleBindings(args),
        options,
      );
      const unbindWindow = bindEvents(window, getWindowBindings(args), options);

      unbindEventsRef.current = function unbindAll() {
        unbindTarget();
        unbindTargetWindow();
        unbindWindow();
      };
    },
    [cancel, getPhase, stop],
  );

  /**
   * pending 단계에서만 사용할 수 있다.
   * startPendingDrag에서 호출되어 지정된 시간 이후 호출된다.
   */
  const startDragging = useCallback(
    function startDragging() {
      const phase: Phase = getPhase();
      if (phase.type !== 'PENDING') {
        throw Error(`Cannot start dragging from phase ${phase.type}`);
      }

      const actions: FluidDragActions = phase.actions.fluidLift(phase.point);

      setPhase({
        type: 'DRAGGING',
        actions,
        hasMoved: false,
      });
    },
    [getPhase, setPhase],
  );

  /**
   * idle 단계에서만 사용할 수 있다.
   * pending 상태에서는 longPressTimerId에 timeForLongPress에
   * 지정된 시간이 지난 후 호출될 콜백인 startDragging이 settimeout으로 등록된다.
   */
  const startPendingDrag = useCallback(
    function startPendingDrag(
      actions: PreDragActions,
      point: Position,
      target: HTMLElement,
    ) {
      if (getPhase().type !== 'IDLE') {
        throw Error('Expected to move from IDLE to PENDING drag');
      }

      const longPressTimerId = setTimeout(startDragging, timeForLongPress);

      setPhase({
        type: 'PENDING',
        point,
        actions,
        longPressTimerId,
      });

      bindCapturingEvents(target);
    },
    [bindCapturingEvents, getPhase, setPhase, startDragging],
  );

  React.useLayoutEffect(
    function mount() {
      listenForCapture();

      return function unmount() {
        // remove any existing listeners
        unbindEventsRef.current();

        // need to kill any pending drag start timer
        const phase: Phase = getPhase();
        if (phase.type === 'PENDING') {
          clearTimeout(phase.longPressTimerId);
          setPhase(idle);
        }
      };
    },
    [getPhase, listenForCapture, setPhase],
  );

  // This is needed for safari
  // Simply adding a non capture, non passive 'touchmove' listener.
  // This forces event.preventDefault() in dynamically added
  // touchmove event handlers to actually work
  // https://github.com/atlassian/react-beautiful-dnd/issues/1374
  React.useLayoutEffect(function webkitHack() {
    const unbind = bindEvents(window, [
      {
        eventName: 'touchmove',
        // using a new noop function for each usage as a single `removeEventListener()`
        // call will remove all handlers with the same reference
        // https://codesandbox.io/s/removing-multiple-handlers-with-same-reference-fxe15
        fn: () => {
          return;
        },
        options: { capture: false, passive: false },
      },
    ]);

    return unbind;
  }, []);
}
