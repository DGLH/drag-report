import styled from 'styled-components';

export const Wrapper = styled.div`
  border: 1px dashed rgb(0, 168, 255);
  position: absolute;
  top: 0;
  left: 0;
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
    user-select: none;
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
