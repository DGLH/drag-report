import React from 'react';
import styled from 'styled-components';

import { DragComponent } from '../types';

const Wrapper = styled.span<{ styled: string; x: number; y: number; active: boolean }>`
  background-color: ${(props) => (props.active ? 'red' : '#000')};
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  will-change: ${(props) => (props.active ? 'transform ' : 'unset')};
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
  cursor: all-scroll;
  ${(props) => `${props.styled};`}
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
      styled={Object.entries(props.style)
        .map(([key, value]) => `${key}: ${value}px`)
        .join(';')}
      active={active === index}
    />
  );
};

export default Child;
