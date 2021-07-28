import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { animationFrameScheduler, fromEvent, Subscription } from 'rxjs';
import { filter, map, observeOn, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AllType, initComponents, DragComponent } from '../types';
import Cloth from './cloth';
import Menus, { MenusProps, initMenus } from 'components/menus';

const DISTANCE = 1;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #eee;
  overflow: auto;
`;

const DragRect = styled.span<DragRect>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
  background-color: #0f0;
`;

interface DragRect {
  width: number;
  height: number;
  x: number;
  y: number;
}

const Center = () => {
  const [dragState, setDragState] = useState<DragRect>({ width: 0, height: 0, x: 0, y: 0 });
  const [childs, setChilds] = useState<DragComponent[]>([]);
  const [menus, setMenus] = useState<MenusProps>(initMenus);

  const subscribe = useRef<Subscription[]>([]);

  const createChildMenu = useCallback(
    (index: string) => [
      {
        label: '删除',
        cmd: 'delete',
        click: () => {
          const filterChilds = childs.filter((_, chidIndex) => chidIndex !== +index);
          setChilds(filterChilds);
          setMenus(initMenus);
        },
        parting: true,
      },
      {
        label: '上升',
        cmd: 'Cmd + Shift + F',
        click: () => {
          setChilds(
            childs.map((child, chidIndex) => {
              if (chidIndex !== +index) return child;
              return { ...child, style: { ...child.style, zIndex: child.style.zIndex! + 1 } };
            }),
          );
          setMenus(initMenus);
        },
      },
      {
        label: '下降',
        cmd: 'Cmd + Shift + D',
        click: () => {
          setChilds(
            childs.map((child, chidIndex) => {
              if (chidIndex !== +index) return child;
              return { ...child, style: { ...child.style, zIndex: child.style.zIndex! - 1 } };
            }),
          );
          setMenus(initMenus);
        },
      },
      {
        label: '置顶',
        cmd: ' ',
        click: () => {
          setChilds(
            childs.map((child, chidIndex) => {
              if (chidIndex !== +index) return child;
              return {
                ...child,
                style: {
                  ...child.style,
                  zIndex:
                    childs.reduce<number>((acc, current, index) => {
                      const zIndex = current.style.zIndex!;
                      if (index === childs.length - 1 && zIndex < 1999 && acc < 1999) {
                        return 1999;
                      }
                      if (zIndex > acc) {
                        return zIndex;
                      }

                      return acc;
                    }, 0) + 1,
                },
              };
            }),
          );
          setMenus(initMenus);
        },
      },
      {
        label: '置底',
        cmd: ' ',
        click: () => {
          setChilds(
            childs.map((child, chidIndex) => {
              if (chidIndex !== +index) return child;
              return {
                ...child,
                style: {
                  ...child.style,
                  zIndex: 0,
                },
              };
            }),
          );
          setMenus(initMenus);
        },
      },
    ],
    [childs],
  );

  useEffect(() => {
    if (subscribe.current[0]) {
      subscribe.current[0].unsubscribe();
    }

    subscribe.current[0] = fromEvent(document.getElementById('drag-center')!, 'contextmenu').subscribe((e) => {
      const event = e as MouseEvent;
      event.preventDefault();

      const index = (event.target as HTMLElement).dataset.index;
      if (!index) return;
      const thisMenus: MenusProps = {
        active: true,
        x: event.x,
        y: event.y,
        menus: createChildMenu(index),
      };

      setMenus(thisMenus);
    });
  }, [createChildMenu]);

  useEffect(() => {
    if (subscribe.current[1]) {
      subscribe.current[1].unsubscribe();
    }

    subscribe.current[1] = fromEvent(document, 'mousedown').subscribe((e) => {
      if ((e.target as HTMLElement).dataset.menu) {
        (e.target as HTMLElement).click();
      } else if (menus.active) setMenus(initMenus);
    });
  }, [menus.active]);

  useEffect(() => {
    let selected: AllType | null;

    const mousedown$ = fromEvent<MouseEvent>(document.getElementById('drag-content')!, 'mousedown');
    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

    const drag$ = mousedown$.pipe(
      filter((e) => e.buttons === 1 && !!(e.target as HTMLElement)!.getAttribute('data-drag')),
      tap((e) => {
        selected = (e.target as HTMLElement)!.getAttribute('data-drag') as AllType;

        const subscribe = mouseup$.subscribe((event) => {
          const clientRect = document.getElementById('drag-cloth')?.getClientRects()[0];

          if (
            event.x >= clientRect!.left &&
            event.x <= clientRect!.right &&
            event.y >= clientRect!.top &&
            event.y <= clientRect!.bottom
          ) {
            const component = initComponents[selected!];
            setChilds((c) => [
              ...c,
              {
                ...component,
                x: event.x - clientRect!.x,
                y: event.y - clientRect!.y,
                style: { ...component.style, zIndex: c.length },
              },
            ]);
          }

          selected = null;
          setDragState({ width: 0, height: 0, x: 0, y: 0 });
          subscribe.unsubscribe();
        });
      }),
      map((e) => ({ x: e.x, y: e.y })),
      switchMap((initial) => {
        return mousemove$.pipe(
          takeUntil(mouseup$),
          map((event) => {
            if (Math.abs(event.x - initial.x) < DISTANCE || Math.abs(event.y - initial.y) < DISTANCE) {
              return {};
            }

            return { x: event.x, y: event.y };
          }),
        );
      }),
      observeOn(animationFrameScheduler),
    );

    const dragMove = (position: { x?: number; y?: number }) => {
      if ((!position.x && !position.y) || !selected) return;

      const component = initComponents[selected!];
      setDragState({ width: component.style.width, height: component.style.height, x: position.x!, y: position.y! });
    };

    drag$.subscribe(dragMove);
  }, []);

  return (
    <Wrapper id="drag-center">
      <Cloth childs={childs} setChilds={setChilds} />
      <DragRect {...dragState} />
      <Menus {...menus} />
    </Wrapper>
  );
};

export { Center };
