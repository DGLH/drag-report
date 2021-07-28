import React, { MouseEventHandler } from 'react';

import { MyBtn } from './styled';

interface Props {
  text: string;
  click?: Function;
  buttonProp?: string;
}

const Button: React.FC<Props> = ({ text, click, buttonProp }) => {
  return (
    <MyBtn buttonProp={buttonProp} onClick={click as unknown as MouseEventHandler<HTMLButtonElement>}>
      {text}
    </MyBtn>
  );
};

export default Button;
