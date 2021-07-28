import React from 'react';

import { Rect } from './styled';

interface Props {
  type: string;
}

const Rectangle: React.FC<Props> = ({ type }) => {
  return <Rect data-drag={type} />;
};

export default Rectangle;
