import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const Style = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -35px;
  z-index: 11;
  width: 100%;
  height: 35px;
  user-select: none;
  border-top: 1px solid rgb(255 255 255 / 20%);
  background-color: rgb(0 0 0 / 50%);
  border-radius: 0;

  .bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0%;
    height: 100%;
    display: inline-block;
    background-color: var(--c-primary-dark);
    overflow: visible;

    .handle {
      position: absolute;
      right: -5px;
      top: 0;
      bottom: 0;
      width: 10px;
      cursor: ew-resize;
      background-color: #c9c9c9;
      color: black;
      display: flex;
      padding: 1px;

      svg {
        display: inline-block;
        margin: auto 0;
        font-size: 9px;
      }
    }
  }

  .subtitle-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column-reverse;

    span {
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: rgb(255 255 255 / 20%);
    }
  }
`;

export default function Progress(props) {
  const [grabbing, setGrabbing] = useState(false);
  const speakers = useSelector(store => store.session.speakers);

  const onProgressClick = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const screenDelta = (event.pageX - props.headingWidth) / (document.body.clientWidth - props.headingWidth);
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
        const screenDelta = (event.pageX - props.headingWidth) / (document.body.clientWidth - props.headingWidth);
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

  const subHeight = 100 / speakers.length;
  const subHeightStyle = `${subHeight}%`;
  const { duration } = props.player;

  return (
    <Style className='progress' onClick={onProgressClick}>
      <div className='bar' style={{ width: `${(props.currentTime / props.player.duration) * 100}%` }}>
        <div className='handle' onMouseDown={onGrabDown}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
      <div className='subtitle-wrapper'>
        {speakers.map((speaker, speakerIndex) => (
            <div key={speakerIndex} className='speaker-subtitle'>
              {speaker.subs.map((sub, index) => (
                <span
                  key={index}
                  className='x'
                  style={{
                    left: `${(sub.startTime / duration) * 100}%`,
                    top: `${subHeight * speakerIndex}%`,
                    width: `${(sub.duration / duration) * 100}%`,
                    height: subHeightStyle,
                  }}
                ></span>
              ))}
            </div>
          ),
        )}
      </div>
    </Style>
  );
};
