import React from 'react';
import styled from 'styled-components';

import { DragComponent } from '../types';

const Wrapper = styled.span<{ x: number; y: number; active: boolean }>`
  background-color: ${(props) => (props.active ? 'red' : '#000')};
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  will-change: ${(props) => (props.active ? 'transform ' : 'unset')};
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
  cursor: all-scroll;
`;

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

export default Child;
