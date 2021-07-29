import React from 'react';

import { DragComponent } from '../../../types';
import { Wrapper } from './styled';

export interface ChildPorps {
  props: DragComponent;
  index: number;
  active: number;
}

const Container: React.FC<ChildPorps> = ({ props, index, active }) => {
  return (
    <Wrapper
      data-index={index}
      x={active === index ? 0 : props.x}
      y={active === index ? 0 : props.y}
      style={{ ...props.style, width: `${props.style.width}px`, height: `${props.style.height}px` }}
      active={active === index}
    />
  );
};

function compare(preProps: ChildPorps, nextProps: ChildPorps) {
  const { active: pactive, index: pindex } = preProps;
  const { x: px, y: py, style: pstyle } = preProps.props;
  const psv = Object.values(pstyle);

  const { active: nactive, index: nindex } = nextProps;
  const { x: nx, y: ny, style: nstyle } = nextProps.props;
  const nsv = Object.values(nstyle);

  if (pactive !== pindex && nactive !== nindex && px === nx && py === ny && psv.every((v, index) => v === nsv[index]))
    return true;
  return false;
}

export const Child = React.memo(Container, compare);
