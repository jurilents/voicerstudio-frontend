import { d2t, predictDuration } from '../../utils';
import unescape from 'lodash/unescape';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlay, faRocket } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import { patchSub } from '../../store/sessionReducer';

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
  return (
    <div
      className={props.className}
      style={props.style}
      onClick={() => {
        if (player) {
          player.pause();
          if (player.duration >= sub.startTime) {
            player.currentTime = sub.startTime + 0.001;
          }
        }
      }}>
      <div className='item'>
        <div className='item-bar item-index'
             style={{ borderColor: color }}>
          <span>{props.index + 1}</span>
        </div>
        <div className='item-bar item-timing'>
          <input type='text' value={d2t(sub.startTime)} title='Start time' onChange={() => {
          }} />
          <input
            className='estimate-duration' type='text'
            value={`${predictDuration(props.rowData.text, selectedSpeaker.lang?.wordsPerMinute)}`}
            title='Estimate duration'
            disabled={true} />
          <input
            className='timing-duration' type='text'
            value={`${d2t(sub.endTime - sub.startTime, true)}`}
            title='Current duration'
            disabled={true} />
          <input type='text' value={d2t(sub.endTime)} title='End time' onChange={() => {
          }} />
        </div>
        <textarea
          maxLength={400}
          spellCheck={false}
          className={[
            'textarea',
            selectedSub.id === sub.id ? 'highlight' : '',
            // checkSub(props.rowData) ? 'illegal' : '',
          ].join(' ').trim()}
          value={unescape(sub.text)}
          onChange={(event) => {
            dispatch(patchSub(sub, {
              text: event.target.value,
            }));
          }} />
        <textarea
          maxLength={400}
          spellCheck={false}
          className={[
            'textarea',
            selectedSub.id === sub.id ? 'highlight' : '',
            // checkSub(props.rowData) ? 'illegal' : '',
          ].join(' ').trim()}
          value={unescape(sub.note)}
          onChange={(event) => {
            dispatch(patchSub(sub, {
              note: event.target.value,
            }));
          }} />
        <div className='item-bar item-actions'>
          <button className='icon-btn generateVoice'
                  onClick={() => speakSub(sub)}
                  title='Generate speech'>
            <FontAwesomeIcon icon={faRocket} />
          </button>
          <button className='icon-btn playVoice'
                  onClick={() => playSub(sub)}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button className='icon-btn playVoice'
                  onClick={() => downloadSub(sub, props.index + 1)}>
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>
    </div>
  );
}
