import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #eee;
  overflow: auto;
`;

export interface DragRect {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const DragRect = styled.span<DragRect>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
  background-color: #0f0;
`;
