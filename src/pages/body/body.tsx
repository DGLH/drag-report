import React from 'react';
import { Center } from './center';
import { Left } from './left';

export const Body = () => {
  return (
    <div className="drag-body">
      <Left />
      <Center />
      <div className="drag-body-right"></div>
    </div>
  );
};
