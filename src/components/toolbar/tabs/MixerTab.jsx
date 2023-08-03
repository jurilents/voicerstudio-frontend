import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { patchSpeaker } from '../../../store/sessionReducer';
import { useAudioControls } from '../../../hooks';

const Style = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  .master {
    ::-ms-fill-lower {
      background: var(--c-primary);
    }
  }

  .volume-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    border: 1px solid rgb(255 255 255 / 20%);

    input {
      transform: rotate(270deg);
      height: 30px;
      width: 200px;
      position: absolute;
      top: 42%;
      left: -99px;
    }

    label {
      font-size: 12px;
      width: 100%;
      text-align: center;
      padding: 5px 2px;
      border-top: 1px solid rgb(255 255 255 / 20%);
      max-height: 62px;
      //text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .input-wrapper {
    position: relative;
    display: inline-block;
    height: 220px;
  }

  .mixer-actions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    border-top: 1px solid rgb(255 255 255 / 20%);
  }

  .speaker-btn {
    border-radius: 1px;
    width: 50%;
    aspect-ratio: 1;
    border: 1px solid rgb(255 255 255 / 20%);

    &:hover {
      background-color: var(--c-primary-dark);
    }

    &.mute-active {
      background-color: var(--c-warn);
    }

    &.solo-active {
      background-color: var(--c-danger);
    }
  }
`;

function AudioVolumeItem({ title, propertyName, type, player }) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const { toggleOriginalMute, toggleOriginalSolo } = useAudioControls();

  return (
    <div className={type ? 'volume-wrapper ' + type : 'volume-wrapper'}>
      <div className='input-wrapper'>
        <input
          type='range' orient='vertical'
          min={0} max={1} step={0.01}
          value={settings[propertyName]}
          onChange={(e) => {
            if (player) player.volume = settings.masterVolume * e.target.value;
            else if (type === 'master') player.volume = settings.originalVolume * e.target.value;
            dispatch(setSettings({ [propertyName]: +e.target.value }));
          }} />
      </div>
      <div>
        {Math.round(settings[propertyName] * 100)}%
      </div>
      <label>{title}</label>
      {type !== 'master' && (
        <div className='mixer-actions'>
          <button className={'btn speaker-btn' + (settings.originalMute ? ' mute-active' : '')}
                  title='Mute'
                  onClick={toggleOriginalMute}>
            M
          </button>
          <button className={'btn speaker-btn' + (settings.originalSolo ? ' solo-active' : '')}
                  title='Solo'
            // onClick={toggleOriginalSolo}
                  disabled={true}>
            S
          </button>
        </div>
      )}
    </div>
  );
}

function SpeakerAudioVolumeItem({ speaker, state, setState }) {
  const dispatch = useDispatch();
  const { toggleSpeakerMute, toggleSpeakerSolo } = useAudioControls();
  console.log('redraw:', speaker.mute);
  return (
    <div style={{ '--c-speaker': speaker.color }}
         className={'speaker-volume volume-wrapper'}>
      <div className='input-wrapper'>
        <input
          type='range' orient='vertical'
          min={0} max={1} step={0.01}
          value={speaker.volume}
          onChange={(e) => {
            dispatch(patchSpeaker(speaker.id, { volume: +e.target.value }));
            setState(!state);
          }} />
      </div>
      <div>
        {Math.round(speaker.volume * 100)}%
      </div>
      <label>{speaker.displayName}</label>
      <div className='mixer-actions'>
        <button className={'btn speaker-btn' + (speaker.mute ? ' mute-active' : '')}
                title='Mute'
                onClick={() => {
                  toggleSpeakerMute(speaker);
                  setState(!state);
                }}>
          M
        </button>
        <button className={'btn speaker-btn' + (speaker.solo ? ' solo-active' : '')}
                title='Solo'
          // onClick={() => toggleSpeakerSolo(speaker)}
                disabled={true}>
          S
        </button>
      </div>
    </div>
  );
}

export default function MixerTab({ player }) {
  const { speakers, selectedSpeaker } = useSelector(store => store.session);
  const [state, setState] = useState(false);

  return (
    <Style className='mixer'>
      <AudioVolumeItem title='Master' propertyName='masterVolume' type='master' player={player} />
      <AudioVolumeItem title='Original' propertyName='originalVolume' player={player} />
      {speakers.map((speaker) => (
        <SpeakerAudioVolumeItem key={speaker.id} speaker={speaker} state={state} setState={setState} />
      ))}
    </Style>
  );
}
