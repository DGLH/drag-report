import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { fromEvent, partition, Subscription } from 'rxjs';
import { switchMap, takeUntil, map, filter } from 'rxjs/operators';

import Child from './child';
import Shape from './shape';
import { DragComponent } from '../types';

const backImg =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=';

const Cloth = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  background-color: #fff;
  margin: 0 auto;
  contain: layout;
  overflow: hidden;
  background-image: url(${backImg});
`;

interface Props {
  childs: DragComponent[];
  setChilds: (childs: DragComponent[]) => void;
}

const Wrapper: React.FC<Props> = ({ childs, setChilds }) => {
  const currentLength = useRef(childs.length);
  const subscribe = useRef<Subscription>();

  const [transfom, setTransform] = useState({ x: 0, y: 0 });
  const [canChangeSelf, setCanChangeSelf] = useState(false);
  const [active, setActive] = useState<number>(-1);

  useEffect(() => {
    if (canChangeSelf && active > -1) {
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
    <Cloth id="drag-cloth">
      {childs.map((child, index) => {
        if (active === index)
          return (
            <Shape
              key={index}
              props={{ ...child, x: child.x + transfom.x, y: child.y + transfom.y }}
              index={index}
              active={active}
            />
          );
        return <Child props={child} key={index} index={index} active={active} />;
      })}
    </Cloth>
  );
};

export default Wrapper;
