import React, { useEffect, useState, useRef } from 'react';
import { fromEvent, partition, Subscription } from 'rxjs';
import { switchMap, takeUntil, map, filter } from 'rxjs/operators';

import { Child } from './child';
import { Shape } from './shape';
import { Wrapper } from './styled';
import { DragComponent } from '../../types';

interface Props {
  childs: DragComponent[];
  setChilds: (childs: DragComponent[]) => void;
}

const Cloth: React.FC<Props> = ({ childs, setChilds }) => {
  const currentLength = useRef(childs.length);
  const subscribe = useRef<Subscription>();

  const [transfom, setTransform] = useState({ x: 0, y: 0 });
  const [canChangeSelf, setCanChangeSelf] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const [updateChild, setUpdateChild] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // 当从 Shape 组件中更新当前活动元素时，才需要更新
  useEffect(() => {
    if (updateChild.x || updateChild.y || updateChild.width || updateChild.height) {
      const copy = [...childs];
      copy[active] = {
        ...copy[active],
        x: copy[active].x + updateChild.x + transfom.x,
        y: copy[active].y + updateChild.y + transfom.y,
        style: {
          ...copy[active].style,
          width: copy[active].style.width + updateChild.width,
          height: copy[active].style.height + updateChild.height,
        },
      };
      setUpdateChild({ x: 0, y: 0, width: 0, height: 0 });
      setTransform({ x: 0, y: 0 });
      setChilds(copy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateChild]);

  useEffect(() => {
    if (canChangeSelf && active > -1 && transfom.x && transfom.y) {
      const activeChild = childs[active];
      const copy = [...childs];
      copy[active] = { ...activeChild, x: activeChild.x + transfom.x, y: activeChild.y + transfom.y };
      setChilds(copy);
      setTransform({ x: 0, y: 0 });
      subscribe.current?.unsubscribe();
    }
    setCanChangeSelf(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canChangeSelf]);

  useEffect(() => {
    if (childs.length > currentLength.current) setActive(childs.length - 1);

    currentLength.current = childs.length;
  }, [childs.length]);

  useEffect(() => {
    const mousedown$ = fromEvent<MouseEvent>(document, 'mousedown');

    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

    const [drag$, other$] = partition(mousedown$, (e) => !!(e.target as HTMLElement)?.getAttribute('data-index'));

    other$
      .pipe(filter((e) => !(e.target as HTMLElement).dataset.menu && !(e.target as HTMLElement).dataset.dot))
      .subscribe(() => setActive(-1));

    // 当 mousedown 选中可拖拽元素时，设置当前活动元素，并且在鼠标抬起时更新整个元素
    drag$.subscribe((e) => {
      setActive(+(e.target as HTMLElement).getAttribute('data-index')!);
      if (e.buttons === 1) subscribe.current = mouseup$.subscribe(() => setCanChangeSelf(true));
    });

    drag$
      .pipe(
        filter((e) => e.buttons === 1),
        switchMap((e) =>
          mousemove$.pipe(
            takeUntil(mouseup$),
            map((event) => ({ x: event.x - e.x, y: event.y - e.y })),
          ),
        ),
      )
      .subscribe((position) => setTransform(position));
  }, []);

  return (
    <Wrapper id="drag-cloth">
      {childs.map((child, index) => {
        if (active === index)
          return (
            <Shape
              key={index}
              props={{ ...child, x: child.x + transfom.x, y: child.y + transfom.y }}
              index={index}
              active={active}
              updataActive={setUpdateChild}
            />
          );
        return <Child props={child} key={index} index={index} active={active} />;
      })}
    </Wrapper>
  );
};

export { Cloth };
