import React from 'react';
import styled from 'styled-components';
import { d2t } from '../../utils';

const Style = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -31px;
  z-index: 12;
  width: 100%;
  font-size: 18px;
  color: rgb(255 255 255 / 75%);
  text-shadow: 0 1px 2px rgb(0 0 0 / 75%);
  text-align: center;
  user-select: none;
  pointer-events: none;
`;

export default function Duration(props) {
  return (
    <Style className='duration'>
      <span>
        {d2t(props.currentTime)} / {d2t(props.player.duration || 0)}
      </span>
    </Style>
  );
};
