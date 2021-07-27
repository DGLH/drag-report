import React from 'react';
import styled from 'styled-components';

const Rect = styled.div`
  width: 70px;
  height: 30px;
  border: 1px solid #000;
  cursor: grab;
`;

interface Props {
  type: string;
}

const Rectangle: React.FC<Props> = ({ type }) => {
  return <Rect data-drag={type} />;
};

export default Rectangle;
