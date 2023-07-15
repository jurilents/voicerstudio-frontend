import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setTime } from '../../store/timelineReducer';

const Style = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 120;
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
    background-color: #323333;
    overflow: visible;

    .handle {
      position: absolute;
      right: -5px;
      top: 0;
      bottom: 0;
      width: 10px;
      cursor: ew-resize;
      background-color: #282c2b;
      color: #c9c9c9;
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

    span {
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: rgb(255 255 255 / 20%);
    }
  }
`;

const Progress = ({ player, headingWidth }) => {
  const [grabbing, setGrabbing] = useState(false);
  const dispatch = useDispatch();
  const speakers = useSelector(store => store.session.speakers);
  const currentTime = useSelector(store => store.timeline.time);

  const setProgress = useCallback((pageX) => {
    const screenDelta = pageX / document.body.clientWidth;
    const newTime = screenDelta * player.duration;
    player.currentTime = newTime;
    dispatch(setTime(newTime));
    window.timelineEngine.setTime(newTime);
    if (window.timelineEngine) {
      const vale = newTime * 96;
      console.log('value: ', window.timelineEngine);
      window.timelineEngine.setScrollLeft(vale);
    }
  }, [dispatch, window.timelineEngine]);

  const onProgressClick = useCallback((event) => {
    if (event.button !== 0) return;
    setProgress(event.pageX);
    // props.waveform.seek(currentTime);
  }, [dispatch, headingWidth, player]);

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
        setProgress(event.pageX);
      }
    },
    [grabbing, player, headingWidth],
  );

  const onDocumentMouseUp = useCallback(() => {
    if (grabbing) {
      setGrabbing(false);
      // waveform.seek(player.currentTime);
    }
  }, [grabbing, player?.currentTime]);

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
  const { duration } = player;

  return (
    <Style className='progress' onClick={onProgressClick}>
      <div className='bar' style={{ width: `${(currentTime / player.duration) * 100}%` }}>
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
                  style={{
                    left: `${(sub.start / duration) * 100}%`,
                    top: `${subHeight * speakerIndex}%`,
                    width: `${(sub.duration / duration) * 100}%`,
                    height: subHeightStyle,
                    backgroundColor: speaker.color,
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

export default Progress;
