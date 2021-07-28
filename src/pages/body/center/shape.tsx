import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fromEvent, merge, animationFrameScheduler } from 'rxjs';
import { switchMap, takeUntil, map, observeOn, filter, tap } from 'rxjs/operators';

import Child, { ChildPorps } from './child';

const Wrapper = styled.div`
  border: 1px dashed rgb(0, 168, 255);
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;

  & .shape-dot {
    width: 8px;
    height: 8px;
    background-color: rgb(0, 168, 255);
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10086;
    will-change: transform;
    user-select: none;
  }

  & .shape-dot:nth-child(1) {
    cursor: nw-resize;
  }
  & .shape-dot:nth-child(2) {
    cursor: n-resize;
  }
  & .shape-dot:nth-child(3) {
    cursor: ne-resize;
  }
  & .shape-dot:nth-child(4) {
    cursor: w-resize;
  }
  & .shape-dot:nth-child(5) {
    cursor: e-resize;
  }
  & .shape-dot:nth-child(6) {
    cursor: sw-resize;
  }
  & .shape-dot:nth-child(7) {
    cursor: s-resize;
  }
  & .shape-dot:nth-child(8) {
    cursor: se-resize;
  }
`;

interface Props extends ChildPorps {
  updataActive: (child: { x: number; y: number; width: number; height: number }) => void;
}

const Shape: React.FC<Props> = ({ props, updataActive, ...args }) => {
  const [childProps, setChildProps] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (shouldUpdate) {
      updataActive({
        x: childProps?.x,
        y: childProps?.y,
        width: childProps?.width,
        height: childProps?.height,
      });
      setChildProps({ x: 0, y: 0, width: 0, height: 0 });
    }
    setShouldUpdate(false);
  }, [childProps, shouldUpdate, updataActive]);

  useEffect(() => {
    const shapeDots = document.getElementsByClassName('shape-dot')!;
    const dotsOne$ = fromEvent<MouseEvent>(shapeDots[0], 'mousedown');
    const dotsTwo$ = fromEvent<MouseEvent>(shapeDots[1], 'mousedown');
    const dotsThree$ = fromEvent<MouseEvent>(shapeDots[2], 'mousedown');
    const dotsFour$ = fromEvent<MouseEvent>(shapeDots[3], 'mousedown');
    const dotsFive$ = fromEvent<MouseEvent>(shapeDots[4], 'mousedown');
    const dotsSix$ = fromEvent<MouseEvent>(shapeDots[5], 'mousedown');
    const dotsSeven$ = fromEvent<MouseEvent>(shapeDots[6], 'mousedown');
    const dotsEight$ = fromEvent<MouseEvent>(shapeDots[7], 'mousedown');

    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

    const one$ = dotsOne$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: event.x - e.x,
              y: event.y - e.y,
              width: e.x - event.x,
              height: e.y - event.y,
            };
          }),
        ),
      ),
    );

    const two$ = dotsTwo$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: 0,
              y: event.y - e.y,
              width: 0,
              height: e.y - event.y,
            };
          }),
        ),
      ),
    );

    const three$ = dotsThree$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: 0,
              y: event.y - e.y,
              width: event.x - e.x,
              height: e.y - event.y,
            };
          }),
        ),
      ),
    );

    const four$ = dotsFour$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: event.x - e.x,
              y: 0,
              width: e.x - event.x,
              height: 0,
            };
          }),
        ),
      ),
    );

    const five$ = dotsFive$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: 0,
              y: 0,
              width: event.x - e.x,
              height: 0,
            };
          }),
        ),
      ),
    );

    const six$ = dotsSix$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: event.x - e.x,
              y: 0,
              width: e.x - event.x,
              height: event.y - e.y,
            };
          }),
        ),
      ),
    );

    const seven$ = dotsSeven$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: 0,
              y: 0,
              width: 0,
              height: event.y - e.y,
            };
          }),
        ),
      ),
    );

    const eight$ = dotsEight$.pipe(
      filter((e) => e.buttons === 1),
      tap(() => {
        const upSubscribe = mouseup$.subscribe(() => {
          setShouldUpdate(true);
          upSubscribe.unsubscribe();
        });
      }),
      switchMap((e) =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            return {
              x: 0,
              y: 0,
              width: event.x - e.x,
              height: event.y - e.y,
            };
          }),
        ),
      ),
    );

    const mergeAll$ = merge(one$, two$, three$, four$, five$, six$, seven$, eight$).pipe(
      observeOn(animationFrameScheduler),
    );

    const moveSubscribe = mergeAll$.subscribe((result) => setChildProps(result));

    return () => moveSubscribe.unsubscribe();
  }, [updataActive]);

  const currentWidth = props.style.width + childProps.width;
  const currentHeight = props.style.height + childProps.height;

  return (
    <Wrapper
      style={{
        width: `${currentWidth + 0.5}px`,
        height: `${currentHeight + 0.5}px`,
        transform: `translate(${props.x + childProps.x - 1}px, ${props.y + childProps.y - 1}px)`,
        zIndex: props.style.zIndex,
      }}
    >
      <span className="shape-dot" data-dot="nw" style={{ transform: `translate(-5.2px, -5.2px)` }} />
      <span className="shape-dot" data-dot="n" style={{ transform: `translate(${currentWidth / 2 - 4}px, -5.2px)` }} />
      <span className="shape-dot" data-dot="ne" style={{ transform: `translate(${currentWidth - 4}px, -5.2px)` }} />
      <span className="shape-dot" data-dot="w" style={{ transform: `translate(-5.2px, ${currentHeight / 2 - 4}px)` }} />
      <span
        className="shape-dot"
        data-dot="e"
        style={{ transform: `translate(${currentWidth - 4}px, ${currentHeight / 2 - 4}px)` }}
      />
      <span className="shape-dot" data-dot="sw" style={{ transform: `translate(-5.2px, ${currentHeight - 4}px)` }} />
      <span
        className="shape-dot"
        data-dot="s"
        style={{ transform: `translate(${currentWidth / 2 - 4}px, ${currentHeight - 4}px)` }}
      />
      <span
        className="shape-dot"
        data-dot="se"
        style={{ transform: `translate(${currentWidth - 4}px, ${currentHeight - 4}px)` }}
      />
      <Child
        {...args}
        props={{
          ...props,
          x: props.x + childProps.x,
          y: props.y + childProps.y,
          style: {
            ...props.style,
            width: props.style.width + childProps.width,
            height: props.style.height + childProps.height,
          },
        }}
      />
    </Wrapper>
  );
};

export default Shape;
