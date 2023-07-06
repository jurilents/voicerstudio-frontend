import styled from 'styled-components';
import { faLocationCrosshairs, faMagnet, faPause, faPencil, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Duration from '../timeline/Duration';
import React, { useCallback } from 'react';
import { setPlaying } from '../../store/timelineReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../store/settingsReducer';

const Style = styled.div`
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: rgb(30 30 30 / 80%);
  padding-bottom: 5px;

  .actions-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 20px;
    margin-bottom: 5px;
    gap: 10px;
    border-bottom: 2px solid rgb(255 255 255 / 10%);
  }

  .btn {
    font-size: 18px;
    max-width: 40px;

    &.focus:active:hover {
      background-color: var(--c-danger);
    }
  }

  .separator {
    display: block;
    background-color: white;
    opacity: 30%;
    width: 2px;
    min-width: 2px;
    min-height: 25px;
    border-radius: 5px;
  }

  .btn {
    background: transparent;
    padding-left: 20px;
    padding-right: 20px;
    opacity: 100%;
    color: white;

    &.active {
      background-color: rgba(0, 150, 136, 0.9);
    }
  }
`;

export function Actions(
  {
    currentTime,
    setRecording,
    player,
  }) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const { playing, recording } = useSelector(store => store.timeline);

  const startRecording = () => {
    setRecording(true);
    dispatch(setPlaying(true));
    player.play();
  };

  const togglePlay = () => {
    if (playing) {
      dispatch(setPlaying(false));
      player.pause();
    } else {
      dispatch(setPlaying(true));
      player.play();
    }
  };

  const patchSettings = useCallback((patch) => {
    dispatch(setSettings(patch));
  }, [dispatch]);


  return (
    <Style className='actions-wrapper'>
      <div className='actions-container'>
        <div className={'btn btn-icon focus' + (settings.drawingMode ? ' active' : '')}
             onClick={() => patchSettings({ drawingMode: !settings.drawingMode })}>
          <FontAwesomeIcon icon={faPencil} />
        </div>
        <div className={'btn btn-icon focus' + (settings.scrollableMode ? ' active' : '')}
             onClick={() => patchSettings({ scrollableMode: !settings.scrollableMode })}>
          <FontAwesomeIcon icon={faLocationCrosshairs} />
        </div>
        <div className={'btn btn-icon focus' + (settings.magnetMode ? ' active' : '')}
             onClick={() => patchSettings({ magnetMode: !settings.magnetMode })}>
          <FontAwesomeIcon icon={faMagnet} />
        </div>
        <div className='separator'></div>
        <div className={'btn btn-icon' + (settings.magnetMode ? ' record' : '')}
             onClick={() => togglePlay()} title='Hotkey: SPASE'>
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </div>
        <div className='separator'></div>
        <div className={'btn btn-icon focus' + (recording ? ' record' : '')}
             onMouseDown={() => startRecording()}>
          <FontAwesomeIcon icon={faStop} />
        </div>
      </div>
      <div className='duration-container'>
        <Duration currentTime={currentTime} player={player} />
      </div>
    </Style>
  );
}
