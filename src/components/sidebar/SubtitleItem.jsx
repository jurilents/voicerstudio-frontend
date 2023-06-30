import { d2t, predictDuration } from '../../utils';
import unescape from 'lodash/unescape';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlay, faRocket } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function SubtitleItem(
  {
    settings,
    player,
    checkSub,
    props,
    updateSub,
    speakSub,
    playSub,
    downloadSub,
    currentSpeaker,
  }) {
  return <div
    className={props.className}
    style={props.style}
    onClick={() => {
      if (player) {
        player.pause();
        if (player.duration >= props.rowData.startTime) {
          player.currentTime = props.rowData.startTime + 0.001;
        }
      }
    }}>
    <div className='item'>
      <div className='item-bar item-index'>
        <span>{props.index + 1}</span>
      </div>
      <div className='item-bar item-timing'>
        <input type='text' value={d2t(props.rowData.startTime)} title='Start time' onChange={() => {
        }} />
        <input className='estimate-duration' type='text'
               value={`${predictDuration(props.rowData.text, currentSpeaker.lang?.wordsPerMinute)}`}
               title='Estimate duration'
               disabled={true} />
        <input className='timing-duration' type='text'
               value={`${d2t(props.rowData.endTime - props.rowData.startTime, true)}`}
               title='Current duration'
               disabled={true} />
        <input type='text' value={d2t(props.rowData.endTime)} title='End time' onChange={() => {
        }} />
      </div>
      <textarea
        maxLength={400}
        spellCheck={false}
        className={[
          'textarea',
          settings.currentSubtitle === props.rowData.id ? 'highlight' : '',
          checkSub(props.rowData) ? 'illegal' : '',
        ].join(' ').trim()}
        value={unescape(props.rowData.text)}
        onChange={(event) => {
          updateSub(props.rowData, {
            text: event.target.value,
          });
        }} />
      <textarea
        maxLength={400}
        spellCheck={false}
        className={[
          'textarea',
          settings.currentSubtitle === props.rowData.id ? 'highlight' : '',
          checkSub(props.rowData) ? 'illegal' : '',
        ].join(' ').trim()}
        value={unescape(props.rowData.note)}
        onChange={(event) => {
          updateSub(props.rowData, {
            note: event.target.value,
          });
        }} />
      <div className='x-bar x-actions'>
        <button className='icon-btn generateVoice'
                onClick={() => speakSub(props.rowData)}
                title='Generate speech'>
          <FontAwesomeIcon icon={faRocket} />
        </button>
        <button className='icon-btn playVoice'
                onClick={() => playSub(props.rowData)}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button className='icon-btn playVoice'
                onClick={() => downloadSub(props.rowData, props.index + 1)}>
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>
    </div>
  </div>;
}
