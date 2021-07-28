import styled from 'styled-components';

export const MyBtn = styled.button<{ buttonProp?: string }>`
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  height: 32px;
  box-sizing: border-box;
  padding: 0 10px;

  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  &:active {
    color: #3a8ee6;
    border-color: #3a8ee6;
    outline: 0;
  }

  ${(props) => props.buttonProp}
`;
