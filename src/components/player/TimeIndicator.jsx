import React from 'react';
import styled from 'styled-components';
import { d2t } from '../../utils';
import { useSelector } from 'react-redux';

const Style = styled.div`
  width: 100%;
  font-size: 15px;
  color: rgb(255 255 255 / 75%);
  text-shadow: 0 1px 2px rgb(0 0 0 / 75%);
  text-align: center;
  user-select: none;
  pointer-events: none;
`;

const TimeIndicator = () => {
  const player = useSelector(store => store.player.videoPlayer);
  const currentTime = useSelector(store => store.timeline.time);
  if (!player) {
    return (
      <></>
    );
  }
  return (
    <Style className='duration'>
      <span>
        {d2t(currentTime)} / {d2t(player.duration || 0)}
      </span>
    </Style>
  );
};

export default TimeIndicator;
