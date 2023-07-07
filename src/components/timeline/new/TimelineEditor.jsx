import styled from 'styled-components';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSub, patchSub, selectSpeaker, selectSub } from '../../../store/sessionReducer';
import { Sub } from '../../../models';
import { t } from 'react-i18nify';
import { setPlaying, setTime } from '../../../store/timelineReducer';
import TimelineWrap from './TimelineWrap';
import ActionAudio from './ActionAudio';
import ActionSubtitle from './ActionSubtitle';
import { useHotkeys } from '../../../hooks';

const Style = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: hidden;

  .timeline-editor {
    width: 100%;
    z-index: 100;
  }

  .timeline-editor-action-right-stretch,
  .timeline-editor-action-left-stretch {
    //z-index: 1000;
  }

  .timeline-editor-action {
    z-index: 100;
    cursor: grab;
    --shadow-size: 5px;
    --shadow-size-minus: -5px;

    &:before, &:after {
      content: " ";
      height: 100%;
      position: absolute;
      top: 0;
      width: var(--shadow-size);
    }

    &:before {
      box-shadow: black -6px 0 var(--shadow-size) var(--shadow-size-minus) inset;
      left: var(--shadow-size-minus);
    }

    &:after {
      box-shadow: black 6px 0 var(--shadow-size) var(--shadow-size-minus) inset;
      right: var(--shadow-size-minus);
    }


    &:has(.selected-sub) {
      z-index: 900;
    }
  }

  .timeline-audio {
    //background-color: red;
  }

  .timeline-sub {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    opacity: 50%;
    border: 1px solid transparent;

    &.focus-sub {
      opacity: 100%;
    }

    &.selected-sub {
      border-color: rgba(180, 180, 180, 0.8);
    }

    .sub-text {
      display: block;
      width: calc(100% - 10px);
      line-height: 1;
      margin-top: 3px;
      text-align: center;
      font-size: 13px;
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-time {
      font-size: 10px;
      opacity: 60%;
    }
  }
`;

const origAudioRowName = 'original-audio-row';

function getTimelineData(speakers, selectedSpeaker, player) {
  console.log('plat', player);
  const data = speakers.map((speaker) => ({
    id: speaker.id,
    selected: speaker.id === selectedSpeaker?.id,
    actions: speaker.subs,
    color: speaker.color,
  }));
  if (!player || isNaN(+player.duration)) return data;

  data.unshift({
    id: origAudioRowName,
    rowHeight: 100,
    actions: [
      {
        id: 'original-audio',
        // effectId: effectKeys.audioTrack,
        start: 0,
        end: player.duration,
        disableDrag: true,
        movable: false,
        flexible: false,
        data: { player },
      },
    ],
  });
  return data;
}

const TimelineEditor = ({ player, headingWidth }) => {
  const hotkeysHandler = useHotkeys({ player });
  const dispatch = useDispatch();
  const { speakers, selectedSpeaker, selectedSub, videoUrl } = useSelector(store => store.session);
  const totalTime = useSelector(store => store.timeline.totalTime);
  const [insertStarPosition, setInsertStartPosition] = useState(0);
  const [recordStartTime, setRecordStartTime] = useState(0);
  // const [recordEndTime, setRecordEndTime] = useState(0);
  // const originalVideoUrl = videoUrl || '/samples/video_placeholder.mp4?t=1';
  const data = getTimelineData(speakers, selectedSpeaker, player);

  useEffect(() => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    engine.listener.on('play', () => {
      dispatch(setPlaying(true));
      player.currentTime = engine.getTime();
    });
    engine.listener.on('paused', () => {
      dispatch(setPlaying(false));
      player.currentTime = engine.getTime();
    });
    engine.listener.on('afterSetTime', ({ time }) => dispatch(setTime(time)));
    engine.listener.on('setTimeByTick', ({ time }) => {
      dispatch(setTime(time));
      // if (true) {
      //   const autoScrollFrom = 500;
      //   const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
      //   timelineState.setScrollLeft(left);
      // }
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
      // lottieControl.destroy();
    };
  }, [window.timelineEngine]);

  // ---------- Timeline Hotkeys ----------
  useEffect(() => {
    window.addEventListener('keydown', hotkeysHandler);
    return () => window.removeEventListener('keydown', hotkeysHandler);
  }, [hotkeysHandler]);

  const startRecord = useCallback((event, params) => {
    const selectedAction = params.row.actions.find(x => x.selected);
    if (!selectedAction) {
      console.log('insert start:', params.time);
      setRecordStartTime(params.time);
    }
  }, [setRecordStartTime]);

  const handleScroll = useCallback((param) => {
    // setLeftTime(param.scrollLeft);
    if (recordStartTime > 0 && recordStartTime < param.scrollLeft) {
      console.log('scroll select');
    }
  }, [recordStartTime]);

  const completeRecord = useCallback((params) => {
    const selectedAction = params.row.actions.find(x => x.selected);
    if (!selectedAction) {
      console.log('insert start:', params.time);
      setRecordStartTime(params.time);
    }
  }, [setRecordStartTime]);

  const addSubtitle = useCallback((param) => {
    const selectedAction = param.row.actions.find(x => x.selected);
    if (!selectedAction) {
      const startTime = +(Math.round(param.time * 10) / 10).toFixed(2);
      console.log('startTime', startTime);
      if (selectedSpeaker.subs.find(x => x.start < startTime && x.end > startTime)) {
        return;
      }
      const newSub = new Sub({
        speakerId: selectedSpeaker.id,
        start: startTime,
        end: startTime + 5,
        text: t('SUB_TEXT'),
      });
      dispatch(addSub(newSub));
    }
  }, [dispatch, selectedSpeaker]);

  const setSubtitle = useCallback((param, lockCursor) => {
    if (param.row.id !== origAudioRowName) {
      if (window.timelineEngine) {
        const cursorTime = window.timelineEngine.getTime();
        if (!lockCursor && (param.action.start >= cursorTime || param.action.end <= cursorTime)) {
          dispatch(setTime(param.action.start));
          window.timelineEngine.setTime(param.action.start);
        }
      }
      dispatch(selectSub(param.action));
    }
  }, [dispatch]);

  const setTimeToSubEnd = useCallback((param) => {
    if (param.row.id !== origAudioRowName) {
      dispatch(setTime(param.action.end));
      if (window.timelineEngine) {
        window.timelineEngine.setTime(param.action.end);
      }
    }
  }, [dispatch]);

  const setSpeaker = useCallback((param) => {
    if (param.row.id && param.row.id !== origAudioRowName) {
      dispatch(selectSpeaker(param.row.id));
    }
  }, [dispatch]);

  const setSubStartEndTime = useCallback((param) => {
    if (param.row.id !== origAudioRowName) {
      if (param.dir === 'left') {
        dispatch(patchSub(param.action, {
          start: param.start,
        }));
      } else if (param.dir === 'right') {
        dispatch(patchSub(param.action, {
          end: param.end,
        }));
      } else {
        dispatch(patchSub(param.action, {
          start: param.start,
          end: param.end,
        }));
      }
    }
  }, [dispatch]);

  const onTimeChange = useCallback((time) => {
    if (window.timelineEngine) {
      window.timelineEngine.pause();
    }
    if (player) {
      player.pause();
      dispatch(setTime(time));
      player.currentTime = time;
    }
  }, [dispatch, player]);

  const getActionRender = useCallback((action, row) => {
    if (row.id === origAudioRowName) {
      return <ActionAudio action={action} row={row} />;
    }
    return <ActionSubtitle action={action} row={row} />;
  }, [selectedSpeaker, selectedSub]);


  return (
    <Style className='noselect'>
      {recordStartTime > 0 && (
        <div
          className='insert-highlight'
          style={{ left: insertStarPosition }}
        ></div>
      )}
      <TimelineWrap
        player={player}
        data={data}
        onTimeChange={onTimeChange}
        onClickAction={setSubtitle}
        onDoubleClickAction={setTimeToSubEnd}
        onActionResizeStart={(param) => setSubtitle(param, true)}
        onActionResizing={setSubStartEndTime}
        onActionMoveStart={(param) => setSubtitle(param, true)}
        onActionMoving={setSubStartEndTime}
        onClickRow={setSpeaker}
        getActionRender={getActionRender}
        onDoubleClickRow={addSubtitle}
      />
      {/*{player &&*/}
      {/*  <Timeline*/}
      {/*    ref={timelineState}*/}
      {/*    startLeft={20}*/}
      {/*    scale={1}*/}
      {/*    scaleWidth={100}*/}
      {/*    autoScroll={true}*/}
      {/*    dragLine={settings.scrollableMode}*/}
      {/*    gridSnap={settings.magnetMode}*/}
      {/*    rowHeight={50}*/}
      {/*    editorData={data}*/}
      {/*    effects={timelineEffects}*/}
      {/*    minScaleCount={scaleCount}*/}
      {/*    maxScaleCount={scaleCount}*/}
      {/*    onChange={() => {*/}
      {/*    }}*/}
      {/*    onClickTimeArea={(event, param) => {*/}
      {/*    }}*/}
      {/*    onClickAction={(event, param) => setSubtitle(param)}*/}
      {/*    onActionResizeStart={(param) => setSubtitle(param)}*/}
      {/*    onActionMoveStart={(param) => setSubtitle(param)}*/}
      {/*    onClickRow={(event, param) => {*/}
      {/*      setSpeaker(param);*/}
      {/*    }}*/}
      {/*    onDoubleClickRow={(event, param) => {*/}
      {/*      addSubtitle(param);*/}
      {/*    }}*/}
      {/*    onActionResizeEnd={(param) => {*/}
      {/*      setSubStartEndTime(param);*/}
      {/*    }}*/}
      {/*    onScroll={(param) => handleScroll(param)}*/}
      {/*    getScaleRender={(scale) => <ScaleMarker scale={scale} />}*/}
      {/*    getActionRender={(action, row) => {*/}
      {/*      if (action.effectId === effectKeys.audioTrack) {*/}
      {/*        return <ActionAudio action={action} row={row} />;*/}
      {/*      }*/}
      {/*      action.selected = action.id === selectedSub?.id;*/}
      {/*      return <ActionSubtitle action={action} row={row} />;*/}
      {/*    }}*/}
      {/*  />}*/}
    </Style>
  );
};

export default memo(
  TimelineEditor,
  (prevProps, nextProps) => {
    const res = //prevProps.playing === nextProps.playing &&
      nextProps.player && prevProps.player?.src === nextProps.player.src;
    return res;
  },
);
