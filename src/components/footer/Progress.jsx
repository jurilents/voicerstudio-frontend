import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {setTime} from '../../store/timelineReducer';

const Style = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
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
    width: 0;
    height: 100%;
    display: inline-block;
    background-color: rgba(49, 51, 51, 0.45);
    overflow: visible;
    z-index: 100;

    .handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 10px;
      cursor: ew-resize;
      background-color: #282c2b;
      color: #c9c9c9;
      display: flex;
      padding: 1px;
      z-index: 111;

      &.handle-start {
        left: -5px;
      }

      &.handle-end {
        right: -5px;
      }

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

function Progress() {
  let player = useSelector((store) => store.player.videoPlayer);
  const [grabbing, setGrabbing] = useState(null);
  const dispatch = useDispatch();
  let {speakers, videoDuration} = useSelector((store) => store.session);
  const currentTime = useSelector((store) => store.timeline.time);
  const {zoomFrom, zoomTo} = useSelector((store) => store.timelineSettings);

  const setProgress = useCallback((pageX) => {
    if (!player?.duration || !window.timelineEngine) return;

    const screenDelta = pageX / document.body.clientWidth;
    const newTime = screenDelta * player.duration;
    player.currentTime = newTime;
    dispatch(setTime(newTime));
    window.timelineEngine.setTime(newTime);
  }, [dispatch, player, videoDuration]);

  const setZoomRange = useCallback((from, to) => {
    if (!player?.duration || !window.timelineEngine) return;

    const screenDelta = pageX / document.body.clientWidth;
    const newTime = screenDelta * player.duration;
    player.currentTime = newTime;
    dispatch(setTime(newTime));
    window.timelineEngine.setTime(newTime);
  }, [dispatch, player, videoDuration]);

  const onProgressClick = useCallback((event) => {
    if (event.button !== 0) return;
    setProgress(event.pageX);
  }, [setProgress]);

  const onGrabFromDown = useCallback((event) => {
    if (event.button !== 0) return;
    setGrabbing('from');
  }, [setGrabbing]);

  const onGrabToDown = useCallback((event) => {
    if (event.button !== 0) return;
    setGrabbing('to');
  }, [setGrabbing]);

  const onGrabMove = useCallback((event) => {
    if (grabbing === 'from') {
      // setProgress(event.pageX);
    } else if (grabbing === 'to') {

    }
  }, [grabbing, setProgress]);

  const onDocumentMouseUp = useCallback(() => {
    if (grabbing) {
      setGrabbing(null);
      // TODO
      // waveform.seek(player.currentTime);
    }
  }, [grabbing, setGrabbing]);

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

  videoDuration ??= player?.duration ?? 0;

  return (
    <Style className="progress timeline-progress-bar" onClick={onProgressClick}>
      <div className="bar" style={{width: `${(currentTime / videoDuration) * 100}%`}}>
        <div className="handle handle-start" onMouseDown={onGrabFromDown}>
          <FontAwesomeIcon icon={faBars}/>
        </div>
        <div className="handle handle-end" onMouseDown={onGrabToDown}>
          <FontAwesomeIcon icon={faBars}/>
        </div>
      </div>
      <div className="subtitle-wrapper">
        {speakers.map((speaker, speakerIndex) => (
          <div key={speakerIndex} className="speaker-subtitle">
            {speaker.subs.map((sub, index) => (
              <span
                key={index}
                style={{
                  left: `${(sub.start / videoDuration) * 100}%`,
                  top: `${subHeight * speakerIndex}%`,
                  width: `${(sub.duration / videoDuration) * 100}%`,
                  height: subHeightStyle,
                  backgroundColor: speaker.color,
                }}
              ></span>
            ))}
          </div>
        ))}
      </div>
    </Style>
  );
};

export default Progress;
