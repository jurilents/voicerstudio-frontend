import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import clamp from 'lodash/clamp';
import { useSelector } from 'react-redux';

const Style = styled.div`
  position: relative;
  z-index: 11;
  cursor: grab;
  height: 12%;
  user-select: none;
  background-color: rgb(33 150 243 / 20%);
  border-top: 1px solid rgb(33 150 243 / 30%);
  border-bottom: 1px solid rgb(33 150 243 / 30%);

  &.grabbing {
    cursor: grabbing;
  }
`;

export default function Grab(props) {
  const scrollableMode = useSelector(store => store.settings.scrollableMode);
  const [grabStartX, setGrabStartX] = useState(0);
  const [grabStartTime, setGrabStartTime] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const onGrabDown = useCallback(
    (event) => {
      console.log('event', event);
      if (event.button !== 0) return;
      setGrabStartX(event.pageX - props.headingWidth);
      setGrabStartTime(props.player.currentTime);
      setGrabbing(true);
    },
    [props.player],
  );

  const onGrabUp = () => {
    setGrabStartX(0);
    setGrabStartTime(0);
    setGrabbing(false);
  };

  const onGrabMove = useCallback(
    (event) => {
      if (grabbing && props.player && props.waveform) {
        console.log(event);
        let screenDelta = (event.pageX - props.headingWidth - grabStartX) / (document.body.clientWidth - props.headingWidth);
        if (!scrollableMode) {
          screenDelta = -screenDelta / 2;
        }
        const currentTime = clamp(
          grabStartTime - screenDelta * 10,
          0,
          props.player.duration,
        );
        props.player.currentTime = currentTime;
        props.waveform.seek(currentTime);
      }
    },
    [grabbing, props.player, props.waveform, grabStartX, grabStartTime],
  );

  useEffect(() => {
    document.addEventListener('mouseup', onGrabUp);
    return () => document.removeEventListener('mouseup', onGrabUp);
  }, []);

  return (
    <Style
      className={`grab ${grabbing ? 'grabbing' : ''}`}
      onMouseDown={onGrabDown}
      onMouseMove={onGrabMove}>
    </Style>
  );
};
