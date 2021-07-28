import styled from 'styled-components';

export interface StyledProps {
  active: boolean;
  x: number;
  y: number;
}

export const Container = styled.div<StyledProps>`
  contain: layout;
  width: 240px;
  position: absolute;
  top: 0;
  left: 0;
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
  display: ${(props) => (props.active ? 'unset' : 'none')};
  z-index: 1008611;
  box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
  background: white;
  border-radius: 4px;
  border: none;
`;

export const Item = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: rgb(0, 0, 0);
  padding: 0 5px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  transition: all 0.1s ease-in-out;
  padding: 0 8px;

  &:hover {
    background-color: #eee;
  }

  & .cmd {
    color: gray;
  }
`;

export const PartingLine = styled.div`
  width: 100%;
  border-top: 1px solid #ccc;
  margin: 2.5px 0;
`;
