import React, { useEffect, useState, useRef, useCallback } from 'react';
import { animationFrameScheduler, fromEvent, Subscription } from 'rxjs';
import { filter, map, observeOn, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Cloth } from './cloth';
import { DISTANCE } from './constants';
import { DragRect, Wrapper } from './styled';
import Menus, { MenusProps, initMenus } from 'components/menus';
import { AllType, initComponents, DragComponent } from '../types';

const Center = React.memo(() => {
  const [dragState, setDragState] = useState<DragRect>({ width: 0, height: 0, x: 0, y: 0 });
  const [childs, setChilds] = useState<DragComponent[]>([]);
  const [menus, setMenus] = useState<MenusProps>(initMenus);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const operationQueue = useRef<Array<DragComponent[]>>([[]]);
  const shouldUpdateQue = useRef<boolean>(false);
  const subscribe = useRef<Subscription[]>([]);

  useEffect(() => {
    if (shouldUpdateQue.current) {
      setCurrentIndex((current) => {
        const next = current + 1;
        const sliceQueue = operationQueue.current.slice(0, next);
        sliceQueue.push(childs);
        operationQueue.current = sliceQueue;

        return current + 1;
      });
    }
    shouldUpdateQue.current = true;
  }, [childs]);

  useEffect(() => {
    if (!shouldUpdateQue.current) {
      setChilds(operationQueue.current[currentIndex]);
    }
  }, [currentIndex]);

  const createChildMenus = useCallback(
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

  const createDefaultMenus = useCallback(
    () => [
      {
        label: '撤销',
        cmd: 'cmd + z',
        click: () => {
          setCurrentIndex((current) => {
            if (current === 0) return 0;
            return current - 1;
          });
          shouldUpdateQue.current = false;
          setMenus(initMenus);
        },
      },
      {
        label: '恢复',
        cmd: 'cmd + shift + z',
        click: () => {
          setCurrentIndex((current) => {
            if (current === operationQueue.current.length - 1) return current;
            return current + 1;
          });
          shouldUpdateQue.current = false;
          setMenus(initMenus);
        },
      },
    ],
    [],
  );

  // 监听 center 组件中的右键点击事件，阻止默认的菜单显示，显示自定义菜单；因为要刷新 effect，所以需要在每次进来时清掉之前的 subscribe
  useEffect(() => {
    if (subscribe.current[0]) {
      subscribe.current[0].unsubscribe();
    }

    subscribe.current[0] = fromEvent(document.getElementById('drag-center')!, 'contextmenu').subscribe((e) => {
      const event = e as MouseEvent;
      event.preventDefault();

      const index = (event.target as HTMLElement).dataset.index;
      let menus = createDefaultMenus();
      if (index) {
        menus = createChildMenus(index);
      }

      setMenus({ active: true, x: event.x, y: event.y, menus });
    });
  }, [createChildMenus, createDefaultMenus]);

  // 当菜单显示的点击菜单中的选项将会手动触发点击事件，菜单不存在的时候不做任何处理；因为要刷新 effect，所以需要在每次进来时清掉之前的 subscribe
  useEffect(() => {
    if (subscribe.current[1]) {
      subscribe.current[1].unsubscribe();
    }

    subscribe.current[1] = fromEvent(document, 'mousedown').subscribe((e) => {
      if (menus.active && (e.target as HTMLElement).dataset.menu) {
        (e.target as HTMLElement).click();
      } else if (menus.active) setMenus(initMenus);
    });
  }, [menus.active]);

  // 监听 #drag-content 上的点击事件，拖拽事件发生时监听 mousemove 事件，当鼠标进入画布区域才会将组件加入
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
                style: { ...component.style, zIndex: c.length + 1 },
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
});

export { Center };
