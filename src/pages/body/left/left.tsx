import React from 'react';
import styled from 'styled-components';

import Rect from 'src/components/rectangle';
import { AllType } from '../types';

const Wrapper = styled.div`
  width: 240px;
  height: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
  user-select: none;
`;

const Left = () => {
  return (
    <Wrapper id="drag-content">
      <Rect type={AllType.rect} />
    </Wrapper>
  );
};

export { Left };
