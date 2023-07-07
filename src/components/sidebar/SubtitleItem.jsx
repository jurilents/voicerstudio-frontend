import { d2t, predictDuration } from '../../utils';
import unescape from 'lodash/unescape';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlay, faRocket } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { patchSub, selectSub } from '../../store/sessionReducer';

export default function SubtitleItem(
  {
    player,
    props,
    sub,
    color,
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
  }, [window.timelineEngine, dispatch, player]);

  const handleSubTextChange = useCallback((event) => {
    dispatch(patchSub(sub, {
      text: event.target.value,
    }));
  }, [dispatch]);

  const handleSubNoteTextChange = useCallback((event) => {
    dispatch(patchSub(sub, {
      note: event.target.value,
    }));
  }, [dispatch]);

  return (
    <div className={props.className}
         style={props.style}
         onClick={handleSubClick}>
      <div style={{ '--c-speaker': color }}
           className={[
             'item',
             selectedSub?.id === sub.id ? 'highlight' : '',
             // checkSub(props.rowData) ? 'illegal' : '',
           ].join(' ')}>
        <div className='item-bar item-index'
             style={{ borderColor: color }}>
          <span>{props.index + 1}</span>
        </div>
        <div className='item-bar item-timing'>
          <input type='text' value={d2t(sub.start)} title='Start time' onChange={() => {
          }} />
          <input
            className='estimate-duration' type='text'
            value={`${predictDuration(props.rowData.text, selectedSpeaker.lang?.wordsPerMinute)}`}
            title='Estimate duration'
            disabled={true} />
          <input
            className='timing-duration' type='text'
            value={`${d2t(sub.end - sub.start, true)}`}
            title='Current duration'
            disabled={true} />
          <input type='text' value={d2t(sub.end)} title='End time' onChange={() => {
          }} />
        </div>
        <textarea
          maxLength={400}
          spellCheck={false}
          className='textarea'
          value={unescape(sub.text)}
          onChange={handleSubTextChange} />
        <textarea
          maxLength={400}
          spellCheck={false}
          className='textarea'
          value={unescape(sub.note)}
          onChange={handleSubNoteTextChange} />
        <div className='item-bar item-actions'>
          <button className='icon-btn generateVoice'
                  onClick={() => speakSub(sub)}
                  title='Generate speech'
                  style={{ color: sub.voicedStatusColor }}>
            <FontAwesomeIcon icon={faRocket} />
          </button>
          <button className='icon-btn playVoice'
                  title=''
                  onClick={() => playSub(sub)}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button className='icon-btn playVoice'
                  title='Generate speech'
                  onClick={() => downloadSub(sub, props.index + 1)}>
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>
    </div>
  );
}
