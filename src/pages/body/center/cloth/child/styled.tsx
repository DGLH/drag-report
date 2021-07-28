import styled from 'styled-components';

export const Wrapper = styled.span<{ x: number; y: number; active: boolean }>`
  background-color: ${(props) => (props.active ? 'red' : '#000')};
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  will-change: ${(props) => (props.active ? 'transform ' : 'unset')};
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
  cursor: all-scroll;
`;
