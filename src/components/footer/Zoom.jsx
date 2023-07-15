import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../store/settingsReducer';

const Style = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -8px;
  z-index: 11;
  width: 100%;
  height: 8px;
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
    background-color: rgb(255 255 255 / 30%);
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
    }
  }
`;

export default function Zoom({ waveform, player, headingWidth }) {
  const [grabbing, setGrabbing] = useState(false);
  const dispatch = useDispatch();
  const { timelineZoom, waveZoom } = useSelector(store => store.settings);
  const [zoom, setZoom] = useState(timelineZoom);

  const onProgressClick = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const screenDelta = (event.pageX) / (document.body.clientWidth);
      const zoomValue = +(Math.max(screenDelta, 0.01)).toFixed(3);
      setZoom(zoomValue);
      dispatch(setSettings({ timelineZoom: zoomValue }));
    },
    [dispatch, headingWidth],
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
        const zoomValue = (event.pageX) / (document.body.clientWidth);
        setZoom(+zoomValue.toFixed(3));
      }
    },
    [grabbing, dispatch, player, headingWidth],
  );

  const onDocumentMouseUp = useCallback(() => {
    if (grabbing) {
      setGrabbing(false);
      if (zoom > 0 && zoom <= 1) {
        // console.log('zoom', zoom);
        dispatch(setSettings({ timelineZoom: zoom }));
      }
    }
  }, [grabbing, dispatch, player.currentTime]);

  useEffect(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onGrabMove);
    return () => {
      document.removeEventListener('mouseup', onDocumentMouseUp);
      document.removeEventListener('mousemove', onGrabMove);
    };
  }, [onDocumentMouseUp, onGrabMove]);

  useEffect(() => {
    if (waveform) {
      waveform.setOptions({
        duration: timelineZoom * 500,
      });
    }
  }, [timelineZoom]);

  useEffect(() => {
    if (waveform) {
      waveform.setOptions({
        waveScale: waveZoom,
      });
    }
  }, [waveZoom]);

  return (
    <Style className='zoom' onClick={onProgressClick}>
      <div className='bar' style={{ width: `${zoom * 100}%` }}>
        <div className='handle' onMouseDown={onGrabDown}></div>
      </div>
    </Style>
  );
};
