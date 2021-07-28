import React from 'react';

import { StyledProps, Container, Item, PartingLine } from './styled';

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
            <span data-menu="menu">{menu.label}</span>
            <span className="cmd" data-menu="menu">
              {menu.cmd}
            </span>
          </Item>
          {menu.parting ? <PartingLine /> : ''}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default Menus;
