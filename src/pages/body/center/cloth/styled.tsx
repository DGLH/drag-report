import styled from 'styled-components';

import { backImg } from '../constants';

export const Wrapper = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  background-color: #fff;
  margin: 0 auto;
  contain: layout;
  overflow: hidden;
  background-image: url(${backImg});
`;
