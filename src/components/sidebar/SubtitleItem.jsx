import { d2t, getDurationStatusColor, time2seconds, toPercentsDelta } from '../../utils';
import unescape from 'lodash/unescape';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faRocket, faStopwatch, faUndo } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { patchSub, selectSub } from '../../store/sessionReducer';
import { settings } from '../../settings';
import { usePlayPause } from '../../hooks';

let requestSync = false;

const SubtitleItem = (params) => {
  const { player, props, sub, speakSub, playSub, downloadSub, selectedSub, selectedSpeaker, showNote } = params;
  const dispatch = useDispatch();
  const { pause } = usePlayPause(player);
  const [startTime, setStartTime] = useState(sub.startStr || '');
  const [endTime, setEndTime] = useState(sub.endStr || '');

  if (requestSync) {
    console.log('sub.startStrsub.startStr', { subStart: sub.startStr, local: startTime });
    setStartTime(sub.startStr);
    setEndTime(sub.endStr);
    requestSync = false;
  }

  const handleSubClick = useCallback(() => {
    if (window.timelineEngine) window.timelineEngine.setTime(sub.start);
    if (player) player.currentTime = sub.start;
    dispatch(selectSub(sub));
  }, [window.timelineEngine, sub, dispatch, player]);

  const handleSubTextChange = useCallback((event, trim = false) => {
    if (trim) event.target.value = event.target.value.trim();
    if (sub.text === event.target.value) return;
    dispatch(patchSub(sub, {
      text: event.target.value,
    }));
  }, [dispatch, sub]);

  const handleSubNoteTextChange = useCallback((event, trim = false) => {
    if (trim) event.target.value = event.target.value.trim();
    if (sub.note === event.target.value) return;
    dispatch(patchSub(sub, {
      note: event.target.value,
    }));
  }, [dispatch, sub]);

  const resetDuration = () => {
    dispatch(patchSub(sub, {
      end: sub.start + sub.data.baseDuration,
    }));
  };

  const updateSubStartTime = (patch) => {
    pause();
    dispatch(patchSub(sub, patch));
    requestSync = true;
  };

  const updateSubEndTime = (time) => {
    pause();
    dispatch(patchSub(sub, { end: time }));
    setEndTime(time);
  };

  return (
    <div className={props.className}
         style={props.style}
         onClick={handleSubClick}>
      <div style={{ '--c-speaker': selectedSpeaker.color }}
           className={[
             'item',
             selectedSub?.id === sub.id ? 'highlight' : '',
             sub.isValid ? '' : 'illegal',
           ].join(' ')}>

        {/* ************ Index ************ */}
        <div className='item-bar item-index'
             style={{ borderColor: selectedSpeaker.color }}>
          <span>{props.index + 1}</span>
        </div>

        {/* ************ Text ************ */}
        <textarea maxLength={settings.subtitleTextLimit}
                  spellCheck={false}
                  className='textarea'
                  value={unescape(sub.text)}
                  onChange={handleSubTextChange}
                  onBlur={(e) => handleSubTextChange(e, true)} />

        {/* ************ Note ************ */}
        {showNote && (
          <textarea maxLength={settings.subtitleTextLimit}
                    spellCheck={false}
                    className='textarea'
                    value={unescape(sub.note)}
                    onChange={handleSubNoteTextChange}
                    onBlur={(e) => handleSubNoteTextChange(e, true)} />
        )}

        {/* ************ Start and End Time ************ */}
        <div className='item-bar item-info'>
          <div className='item-bar-center-row'>
            <input type='time'
                   step={0.001}
                   className={sub.invalidStart ? 'invalid' : ''}
                   value={startTime}
                   title='Start time'
                   onChange={(event) => setStartTime(event.target.value)}
                   onBlur={() => updateSubStartTime({ start: time2seconds(startTime) })} />
            <span className='time-sep'>–</span>
            <input type='time'
                   value={sub.endStr}
                   step={1}
                   className={sub.invalidEnd ? 'invalid' : ''}
              // value={formatTime(sub.end)}
                   title='End time'
                   onChange={(event) => {
                   }} />
          </div>

          {/* ************ Duration ************ */}
          <div className='item-bar-center-row item-timing' title='Duration'>
            <input className='dimmed' type='text'
                   value={`${d2t(sub.end - sub.start, true)}s`}
                   disabled={true} />
            <div className='item-icon'>
              <FontAwesomeIcon icon={faStopwatch} />
            </div>
            {/*<span><FontAwesomeIcon icon={faGaugeSimpleHigh} /></span>*/}
            <input type='text'
                   style={{ color: getDurationStatusColor(sub.speedRate - 1) }}
                   value={toPercentsDelta(sub.speedRate - 1, true, 1)}
                   title='Acceleration %'
                   disabled={true} />
          </div>

          {/* ************ Action Buttons ************ */}
          <div className='item-bar-row item-actions'>
            <button className='icon-btn'
                    title='Download speech from this subtitle'
                    onClick={() => downloadSub(sub, props.index + 1)}
                    disabled={!sub?.data?.baseDuration}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
            {/*<button className='icon-btn'*/}
            {/*        title='Listen this subtitle'*/}
            {/*        onClick={() => playSub(sub)}*/}
            {/*        disabled={!sub?.data?.baseDuration}>*/}
            {/*  <FontAwesomeIcon icon={faPlay} />*/}
            {/*</button>*/}
            <button className='icon-btn highlight'
                    style={{ color: sub.voicedStatusColor }}
                    title='Speak this subtitle'
                    onClick={() => speakSub(sub, { speed: 0 })}>
              <FontAwesomeIcon icon={faRocket} />
            </button>
            <button className='icon-btn'
                    title='Reset subtitle speed to default'
                    onClick={resetDuration}
                    disabled={!sub?.data?.baseDuration}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtitleItem;
