import React from 'react';

import { DragComponent } from '../../../types';
import { Wrapper } from './styled';

export interface ChildPorps {
  props: DragComponent;
  index: number;
  active: number;
}

const Child: React.FC<ChildPorps> = ({ props, index, active }) => {
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

export { Child };
