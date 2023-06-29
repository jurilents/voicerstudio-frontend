import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Style = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -35px;
  z-index: 11;
  width: 100%;
  height: 35px;
  user-select: none;
  border-top: 1px solid rgb(255 255 255 / 20%);
  background-color: rgb(0 0 0 / 50%);

  .bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0%;
    height: 100%;
    display: inline-block;
    background-color: #730000;
    overflow: hidden;

    .handle {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 10px;
      cursor: ew-resize;
      background-color: #ff9800;
    }
  }

  .subtitle {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    span {
      position: absolute;
      top: 0;
      bottom: 0;
      height: 100%;
      background-color: rgb(255 255 255 / 20%);
    }
  }
`;

export default function Progress(props) {
  const [grabbing, setGrabbing] = useState(false);

  const onProgressClick = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const screenDelta = (event.pageX - props.headingWidth + 5) / (document.body.clientWidth - props.headingWidth);
      const currentTime = screenDelta * props.player.duration;
      props.player.currentTime = currentTime;
      props.waveform.seek(currentTime);
    },
    [props],
  );

  const onGrabDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      setGrabbing(true);
    },
    [setGrabbing],
  );

  const onGrabMove = useCallback(
    (event) => {
      if (grabbing) {
        const screenDelta = (event.pageX - props.headingWidth + 5) / (document.body.clientWidth - props.headingWidth);
        props.player.currentTime = screenDelta * props.player.duration;
      }
    },
    [grabbing, props.player, props.headingWidth],
  );

  const onDocumentMouseUp = useCallback(() => {
    if (grabbing) {
      setGrabbing(false);
      props.waveform.seek(props.player.currentTime);
    }
  }, [grabbing, props.waveform, props.player.currentTime]);

  useEffect(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onGrabMove);
    return () => {
      document.removeEventListener('mouseup', onDocumentMouseUp);
      document.removeEventListener('mousemove', onGrabMove);
    };
  }, [onDocumentMouseUp, onGrabMove]);

  return (
    <Style className='progress' onClick={onProgressClick}>
      <div className='bar' style={{ width: `${(props.currentTime / props.player.duration) * 100}%` }}>
        <div className='handle' onMouseDown={onGrabDown}></div>
      </div>
      <div className='subtitle'>
        {props.subtitle.length <= 200
          ? props.subtitle.map((item, index) => {
            const { duration } = props.player;
            return (
              <span
                key={index}
                className='item'
                style={{
                  left: `${(item.startTime / duration) * 100}%`,
                  width: `${(item.duration / duration) * 100}%`,
                }}
              ></span>
            );
          })
          : null}
      </div>
    </Style>
  );
};
