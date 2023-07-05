import styled from 'styled-components';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSub, patchSub, selectSpeaker, selectSub } from '../../../store/sessionReducer';
import { Sub } from '../../../models';
import { t } from 'react-i18nify';
import { effectKeys } from '../../../utils/timelineEffects';
import { setPlaying, setTime } from '../../../store/timelineReducer';
import TimelineWrap from './TimelineWrap';
import ActionAudio from './ActionAudio';
import ActionSubtitle from './ActionSubtitle';

const Style = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .timeline-editor {
    width: 100%;
    z-index: 100;
  }

  .timeline-audio {
    background-color: red;
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

function getTimelineData(speakers, selectedSpeaker, videoUrl, audioDuration) {
  const data = speakers.map((speaker) => ({
    id: speaker.id,
    selected: speaker.id === selectedSpeaker?.id,
    actions: speaker.subs,
    effectId: 'textsub',
    color: speaker.color,
  }));
  data.unshift({
    id: 'original-audio-row',
    effectId: effectKeys.audioTrack,
    actions: [
      {
        id: 'original-audio',
        start: 0,
        end: audioDuration,
        disableDrag: true,
        data: {
          src: videoUrl,
        },
      },
    ],
  });
  return data;
}

function calcScaleCount(duration, scale) {
  if (!duration || isNaN(duration)) {
    duration = 60;
  }
  return (duration / scale) + 1;
}

let playing = false; // useSelector(store => store.timeline.playing);
let timelineEngine = null;

const TimelineEditor = ({ player, headingWidth }) => {
  const dispatch = useDispatch();
  const { speakers, selectedSpeaker, selectedSub, videoUrl } = useSelector(store => store.session);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [time, setTime] = useState(0);
  const [insertStarPosition, setInsertStartPosition] = useState(0);
  const [recordStartTime, setRecordStartTime] = useState(0);
  // const [recordEndTime, setRecordEndTime] = useState(0);
  const originalVideoUrl = videoUrl || '/samples/video_placeholder.mp4?t=1';
  const data = getTimelineData(speakers, selectedSpeaker, originalVideoUrl, 100);
  // const [leftTime, setLeftTime] = useState(0);
  // const [rightTime, setRightTime] = useState();

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
  }, [window.timelineEngine, playing]);

  const handlePlayOrPause = useCallback(() => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    playing = !playing;
    if (engine.isPlaying !== playing) {
      if (engine.isPlaying) {
        console.log('-----pause');
        engine.pause();
        player.pause();
      } else {
        console.log('-----play');
        engine.play({ autoEnd: true });
        player.play();
      }
    }
  }, [window.timelineEngine]);

  useEffect(() => {
    if (!window.timelineEngine) return;
    const listener = (event) => {
      const keyName = event.key.toLowerCase();
      if (keyName === ' ') {
        handlePlayOrPause();
      }
    };
    document.addEventListener('keydown', listener, false);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [window.timelineEngine]);

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
      const newSub = new Sub({
        speakerId: selectedSpeaker.id,
        start: startTime,
        end: startTime + 5,
        text: t('SUB_TEXT'),
      });
      dispatch(addSub(newSub));
    }
  }, [dispatch, selectedSpeaker]);

  const setSubtitle = useCallback((param) => {
    if (param.row.id !== origAudioRowName) {
      dispatch(selectSub(param.action));
    }
  }, [dispatch]);

  const setSpeaker = useCallback((param) => {
    console.log('set speaker');
    console.log('param.row.id', param.row.id);
    if (param.row.id !== origAudioRowName) {
      dispatch(selectSpeaker(param.row.id));
    }
  }, [dispatch]);

  const setSubStartEndTime = useCallback((param) => {
    if (param.row.id !== origAudioRowName) {
      dispatch(patchSub(param.action, {
        start: param.action.start,
        end: param.action.end,
      }));
    }
  }, [dispatch]);

  const onTimeChange = useCallback((time) => {
    if (player) {
      console.log('set time', time);
      dispatch(setTime(time));
      player.currentTime = time;
    }
  }, [dispatch, player]);

  const getActionRender = useCallback((action, row) => {
    console.log('render component');
    if (action.effectId === effectKeys.audioTrack) {
      return <ActionAudio action={action} row={row} />;
    }
    return <ActionSubtitle action={action} row={row} />;
  }, [selectedSpeaker, selectedSub]);


  const scaleCount = calcScaleCount(player?.duration, 1);

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
        scaleCount={scaleCount}
        onTimeChange={onTimeChange}
        onClickAction={setSubtitle}
        onClickRow={setSpeaker}
        getActionRender={getActionRender}
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
