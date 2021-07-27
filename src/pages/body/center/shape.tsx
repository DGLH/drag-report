import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { fromEvent, Subscription, merge } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';

import Child, { ChildPorps } from './child';

const Wrapper = styled.div<{ width: number; height: number; x: number; y: number }>`
  border: 1px dashed rgb(0, 168, 255);
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  transform: ${(props) => `translate(${props.x - 1}px, ${props.y - 1}px)`};
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

const Shape: React.FC<ChildPorps> = ({ props, ...args }) => {
  const [childProps, setChildProps] = useState(props);
  const subscribe = useRef<Subscription>();

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
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { x: init.x + init.style.width, y: init.y + init.style.height };

            return {
              ...init,
              x: event.x,
              y: event.y,
              style: { width: endPoint.x - event.x, height: endPoint.y - event.y },
            };
          }),
        ),
      ),
    );

    const two$ = dotsTwo$.pipe(
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { y: init.y + init.style.height };

            return { ...init, y: event.y, style: { width: init.style.width, height: endPoint.y - event.y } };
          }),
        ),
      ),
    );

    const three$ = dotsThree$.pipe(
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { x: init.x, y: init.y + init.style.height };

            return {
              ...init,
              y: event.y,
              style: { width: event.x - endPoint.x, height: endPoint.y - event.y },
            };
          }),
        ),
      ),
    );

    const four$ = dotsFour$.pipe(
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { x: init.x + init.style.width };

            return {
              ...init,
              x: event.x,
              style: { width: endPoint.x - event.x, height: init.style.height },
            };
          }),
        ),
      ),
    );

    const five$ = dotsFive$.pipe(
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { x: init.x };

            return {
              ...init,
              style: { width: event.x - endPoint.x, height: init.style.height },
            };
          }),
        ),
      ),
    );

    const six$ = dotsSix$.pipe(
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { x: init.x + init.style.width };

            return {
              ...init,
              x: event.x,
              style: { width: endPoint.x - event.x, height: init.style.height },
            };
          }),
        ),
      ),
    );

    const seven$ = dotsSeven$.pipe(
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { y: init.y };

            return {
              ...init,
              style: { width: init.style.width, height: event.y - endPoint.y },
            };
          }),
        ),
      ),
    );

    const eight$ = dotsEight$.pipe(
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            const init = childProps;
            const endPoint = { x: init.x, y: init.y };

            return {
              ...init,
              style: { width: event.x - endPoint.x, height: event.y - endPoint.y },
            };
          }),
        ),
      ),
    );

    const mergeAll$ = merge(one$, two$, three$, four$, five$, six$, seven$, eight$);

    subscribe.current = mergeAll$.subscribe(setChildProps);
  }, [childProps]);
  const { width, height } = childProps.style;

  return (
    <Wrapper width={props.style.width} height={props.style.height} x={props.x} y={props.y}>
      <span className="shape-dot" data-dot="nw" style={{ transform: `translate(-5.2px, -5.2px)` }} />
      <span className="shape-dot" data-dot="n" style={{ transform: `translate(${width / 2 - 4}px, -5.2px)` }} />
      <span className="shape-dot" data-dot="ne" style={{ transform: `translate(${width - 4}px, -5.2px)` }} />
      <span className="shape-dot" data-dot="w" style={{ transform: `translate(-5.2px, ${height / 2 - 4}px)` }} />
      <span
        className="shape-dot"
        data-dot="e"
        style={{ transform: `translate(${width - 4}px, ${height / 2 - 4}px)` }}
      />
      <span className="shape-dot" data-dot="sw" style={{ transform: `translate(-5.2px, ${height - 4}px)` }} />
      <span
        className="shape-dot"
        data-dot="s"
        style={{ transform: `translate(${width / 2 - 4}px, ${height - 4}px)` }}
      />
      <span className="shape-dot" data-dot="se" style={{ transform: `translate(${width - 4}px, ${height - 4}px)` }} />
      <Child {...args} props={childProps} />
    </Wrapper>
  );
};

export default Shape;
