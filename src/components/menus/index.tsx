import React from 'react';
import styled from 'styled-components';

interface StyledProps {
  active: boolean;
  x: number;
  y: number;
}

const Container = styled.div<StyledProps>`
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
  padding: 3px;
`;

const Item = styled.div`
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

  &:hover {
    background-color: #eee;
  }

  & .cmd {
    color: gray;
  }
`;

const PartingLine = styled.div`
  width: 100%;
  border-top: 1px solid #ccc;
  margin: 2.5px 0;
`;

interface MenuItem {
  label: string;
  cmd: string;
  click: Function;
  parting?: boolean;
}

export interface MenusProps extends StyledProps {
  menus: Array<MenuItem>;
}

export const initMenus = { menus: [], active: false, x: 0, y: 0 };

const Menus: React.FC<MenusProps> = ({ menus, ...args }) => {
  return (
    <Container {...args}>
      {menus.map((menu) => (
        <React.Fragment key={menu.label}>
          <Item data-menu="menu" onClick={() => menu.click()}>
            <span>{menu.label}</span>
            <span className="cmd">{menu.cmd}</span>
          </Item>
          {menu.parting ? <PartingLine /> : ''}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default Menus;
