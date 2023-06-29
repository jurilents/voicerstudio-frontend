import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import DT from 'duration-time-conversion';
import { t } from 'react-i18nify';

const Style = styled.div`
  position: absolute;
  z-index: 8;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: ew-resize;
  user-select: none;

  .template {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    background-color: rgba(76, 175, 80, 0.5);
    border-left: 1px solid rgba(76, 175, 80, 0.8);
    border-right: 1px solid rgba(76, 175, 80, 0.8);
    user-select: none;
    pointer-events: none;
  }
`;

function findIndex(subs, startTime) {
  return subs.findIndex((item, index) => {
    return (
      (startTime >= item.endTime && !subs[index + 1]) ||
      (item.startTime <= startTime && item.endTime > startTime) ||
      (startTime >= item.endTime && subs[index + 1] && startTime < subs[index + 1].startTime)
    );
  });
}

let lastRecording = false;

export default function Metronome(
  {
    render,
    subtitle,
    newSub,
    addSub,
    player,
    playing,
    recording,
    currentTime,
    headingWidth,
  }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragEndTime, setDragEndTime] = useState(0);
  const gridGap = (document.body.clientWidth - headingWidth) / render.gridNum;

  const getEventTime = useCallback(
    (event) => {
      return (event.pageX - headingWidth - render.padding * gridGap) / gridGap / 10 + render.beginTime;
    },
    [gridGap, render, headingWidth],
  );

  const onMouseDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const clickTime = getEventTime(event);
      setIsDragging(true);
      setDragStartTime(clickTime);
    },
    [getEventTime],
  );

  const onMouseMove = useCallback(
    (event) => {
      if (isDragging) {
        if (playing) player.pause();
        setDragEndTime(getEventTime(event));
      }
    },
    [isDragging, playing, player, getEventTime],
  );

  const onDocumentMouseUp = useCallback(() => {
    if (isDragging) {
      if (dragStartTime > 0 && dragEndTime > 0 && dragEndTime - dragStartTime >= 0.2) {
        const index = findIndex(subtitle, dragStartTime) + 1;
        const start = DT.d2t(dragStartTime);
        const end = DT.d2t(dragEndTime);
        addSub(
          index,
          newSub({
            start,
            end,
            text: t('SUB_TEXT'),
          }),
        );
      }
    }
    setIsDragging(false);
    setDragStartTime(0);
    setDragEndTime(0);
  }, [isDragging, dragStartTime, dragEndTime, subtitle, addSub, newSub]);

  useEffect(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    return () => document.removeEventListener('mouseup', onDocumentMouseUp);
  }, [onDocumentMouseUp]);

  const startRecordingSub = useCallback(() => {
    setIsDragging(true);
    setDragStartTime(currentTime);
  }, [currentTime]);

  const stopRecordingSub = useCallback(() => {
    if (dragStartTime > 0 && dragEndTime > 0 && dragEndTime - dragStartTime >= 0.2) {
      const index = findIndex(subtitle, dragStartTime) + 1;
      const start = DT.d2t(dragStartTime);
      const end = DT.d2t(dragEndTime);
      const sub = newSub({ start, end, text: t('SUB_TEXT') });
      addSub(index, sub);
    }
    setIsDragging(false);
    setDragStartTime(0);
    setDragEndTime(0);
  }, [currentTime]);

  const updateRecordingSub = useCallback(() => {
    setDragEndTime(currentTime);
  }, [currentTime]);

  useEffect(() => {
    if (recording === lastRecording) {
      updateRecordingSub();
      return;
    }

    if (recording) {
      startRecordingSub();
    } else {
      stopRecordingSub();
    }
    lastRecording = recording;
  }, [recording, updateRecordingSub, startRecordingSub, stopRecordingSub]);

  return (
    <Style className='metronome' onMouseDown={onMouseDown} onMouseMove={onMouseMove}>
      {player && !playing && dragStartTime && dragEndTime && dragEndTime > dragStartTime ? (
        <div
          className='template'
          style={{
            left: render.padding * gridGap + (dragStartTime - render.beginTime) * gridGap * 10,
            width: (dragEndTime - dragStartTime) * gridGap * 10,
          }}
        ></div>
      ) : null}
    </Style>
  );
}
