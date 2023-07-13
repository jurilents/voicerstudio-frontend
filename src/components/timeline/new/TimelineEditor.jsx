import styled from 'styled-components';
import React, { memo, useCallback, useEffect } from 'react';
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

  .timeline-editor-action {
    background-color: transparent;
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
      line-height: 1.8;
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

  .recording-sub {
    background-color: rgba(200 0 0 / 50%);
    border-right: 1px solid white;
    border-left: 1px solid #ff7272;
  }

  .timeline-audio {
    wave {
      overflow: hidden !important;
    }
  }
`;

const origAudioRowName = 'original-audio-row';

function getTimelineData(speakers, selectedSpeaker, recordingSub, player) {
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

const timelineOptions = {
  startLeft: 20,
  scale: 1,
  scaleWidth: 100,
};

function calcLeftOffset(time) {
  const pixelPerSecond = timelineOptions.scaleWidth / timelineOptions.scale;
  return time * pixelPerSecond + timelineOptions.startLeft;
}

const TimelineEditor = ({ player }) => {
  const hotkeysHandler = useHotkeys({ player });
  const dispatch = useDispatch();
  const { speakers, selectedSpeaker, selectedSub, videoUrl } = useSelector(store => store.session);
  // const recordingSub = useSelector(store => store.timeline.recordingSub);
  // const [recordEndTime, setRecordEndTime] = useState(0);
  // const originalVideoUrl = videoUrl || '/samples/video_placeholder.mp4?t=1';
  const data = getTimelineData(speakers, selectedSpeaker, window.recordingSub, player);

  useEffect(() => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    const $cursorElm = document.querySelector('.timeline-editor-cursor');

    function scrollToCursor(time) {
      const totalWidth = engine.target.clientWidth;
      const cursorPosition = +$cursorElm.style.left.substring(0, $cursorElm.style.left.length - 2);
      const cursorDelta = totalWidth - cursorPosition;

      if (cursorDelta < 10 && cursorDelta > 0) {
        engine.setScrollLeft(calcLeftOffset(time) - 5);
      } else if (cursorDelta <= 0 || cursorDelta > totalWidth) {
        engine.setScrollLeft(calcLeftOffset(time) - 150);
      }
    }

    engine.listener.on('play', () => {
      dispatch(setPlaying(true));
      player.currentTime = engine.getTime();
    });
    engine.listener.on('paused', () => {
      dispatch(setPlaying(false));
      player.currentTime = engine.getTime();
    });
    engine.listener.on('afterSetTime', ({ time }) => {
      dispatch(setTime(time));

      setTimeout(() => {
        scrollToCursor(time);
      }, 50);
    });
    engine.listener.on('setTimeByTick', ({ time }) => {
      if (window.recordingSub) {
        window.recordingSub.end = time;
      }
      dispatch(setTime(time));
      scrollToCursor(time);
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

  const handleScroll = useCallback((param) => {
    // if (window.recordingSub) {
    //   console.log('scroll select recordingSub', param);
    //   window.recordingSub.end = param.scrollLeft;
    // dispatch(recordSub(recordingSub, param.scrollLeft));
    // }
  }, []);

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
  }, [window.recordingSub, dispatch, player]);

  const getActionRender = useCallback((action, row) => {
    // console.log('rerendering!!');
    if (row.id === origAudioRowName) {
      return <ActionAudio action={action} row={row} />;
    }
    return <ActionSubtitle action={action} row={row} />;
  }, [selectedSpeaker, selectedSub]);

  return (
    <Style className='noselect'>
      {window.recordingSub && (
        <div className='insert-highlight'
             style={{
               top: `${92 + (50 * selectedSpeaker.id)}px`,
               left: `${(20 + window.recordingSub.start)}px`,
               width: `${(window.recordingSub.end - window.recordingSub.start)}px`,
             }}>
        </div>
      )}
      <TimelineWrap
        player={player}
        data={data}
        startLeft={timelineOptions.startLeft}
        scale={timelineOptions.scale}
        scaleWidth={timelineOptions.scaleWidth}
        onTimeChange={onTimeChange}
        onScroll={handleScroll}
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
