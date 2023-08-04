import { d2t, formatTime, getDurationStatusColor } from '../../utils';
import unescape from 'lodash/unescape';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlay, faRocket, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { patchSub, selectSub } from '../../store/sessionReducer';
import { settings } from '../../settings';

export default function SubtitleItem(
  {
    player,
    props,
    sub,
    speakSub,
    playSub,
    downloadSub,
    selectedSub,
    selectedSpeaker,
  }) {
  const dispatch = useDispatch();

  const handleSubClick = useCallback(() => {
    if (window.timelineEngine) window.timelineEngine.setTime(sub.start);
    if (player) player.currentTime = sub.start;
    dispatch(selectSub(sub));
  }, [window.timelineEngine, sub, dispatch, player]);

  const handleSubTextChange = useCallback((event) => {
    dispatch(patchSub(sub, {
      text: event.target.value,
    }));
  }, [dispatch, sub]);

  const handleSubNoteTextChange = useCallback((event) => {
    dispatch(patchSub(sub, {
      note: event.target.value,
    }));
  }, [dispatch, sub]);

  return (
    <div className={props.className}
         style={props.style}
         onClick={handleSubClick}>
      <div style={{ '--c-speaker': selectedSpeaker.color }}
           className={[
             'item',
             selectedSub?.id === sub.id ? 'highlight' : '',
             // checkSub(props.rowData) ? 'illegal' : '',
           ].join(' ')}>
        {/* ************ Text ************ */}
        <textarea maxLength={settings.subtitleTextLimit}
                  spellCheck={false}
                  className='textarea'
                  value={unescape(sub.text)}
                  onChange={handleSubTextChange} />
        {/* ************ Note ************ */}
        <textarea maxLength={settings.subtitleTextLimit}
                  spellCheck={false}
                  className='textarea'
                  value={unescape(sub.note)}
                  onChange={handleSubNoteTextChange} />
        {/* ************ Timing ************ */}
        <div className='item-bar item-info'>
          <div className='item-bar-center-row'>
            <input type='text' value={formatTime(sub.start)} title='Start time' onChange={() => {
            }} />
            <span>–</span>
            <input type='text' value={formatTime(sub.end)} title='End time' onChange={() => {
            }} />
          </div>
          {/* ************ Duration ************ */}
          <div className='item-bar-center-row item-timing' title='Duration'>
            <input className='dimmed' type='text'
                   value={`${d2t(sub.end - sub.start, true)}`}
                   disabled={true} />
            <div className='item-icon'>
              <FontAwesomeIcon icon={faStopwatch} />
            </div>
            {/*<span><FontAwesomeIcon icon={faGaugeSimpleHigh} /></span>*/}
            <input className='dimmed' type='text'
                   style={{ color: getDurationStatusColor(Math.random() * 30) }}
                   value={`+20%`}
                   title='Acceleration percentage'
                   disabled={true} />
          </div>
          {/* ************ Action Buttons ************ */}
          <div className='item-bar-row item-actions'>
            <button className='icon-btn'
                    title='Download speech from this subtitle'
                    onClick={() => downloadSub(sub, props.index + 1)}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
            <button className='icon-btn'
                    title='Listen this subtitle'
                    onClick={() => playSub(sub)}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
            <button className='icon-btn highlight'
                    style={{ color: sub.voicedStatusColor }}
                    title='Speak this subtitle'
                    onClick={() => speakSub(sub, { speed: 1 })}>
              <FontAwesomeIcon icon={faRocket} />
            </button>
          </div>
        </div>
        {/* ************ Index ************ */}
        <div className='item-bar item-index'
             style={{ borderColor: selectedSpeaker.color }}>
          <span>{props.index + 1}</span>
        </div>
      </div>
    </div>
  );
}
