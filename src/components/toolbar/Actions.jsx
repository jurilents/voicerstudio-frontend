import styled from 'styled-components';
import { faLocationCrosshairs, faMagnet, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimeIndicator from './TimeIndicator';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { setTimelineSettings } from '../../store/timelineSettingsReducer';

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

export function Actions({ player }) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.timelineSettings);
  const { playing, recording } = useSelector(store => store.timeline);
  const { startRecording, completeRecording, togglePlay, pause } = usePlayerControls(player);

  useEffect(() => {
    document.addEventListener('mouseup', completeRecording);
    return () => document.removeEventListener('mouseup', completeRecording);
  }, [completeRecording]);

  const patchSettings = useCallback((patch) => {
    pause();
    dispatch(setTimelineSettings(patch));
  }, [pause, dispatch]);


  return (
    <Style className='actions-wrapper'>
      <div className='actions-container'>
        <div className={'btn btn-icon focus' + (settings.scrollableMode ? ' active' : '')}
             onClick={() => patchSettings({ scrollableMode: !settings.scrollableMode })}
             title='Navigation lines'>
          <FontAwesomeIcon icon={faMagnet} />
        </div>
        <div className={'btn btn-icon focus' + (settings.magnetMode ? ' active' : '')}
             onClick={() => patchSettings({ magnetMode: !settings.magnetMode })}
             title='Move by fixed timesteps'>
          <FontAwesomeIcon icon={faLocationCrosshairs} />
        </div>
        <div className='separator'></div>
        <div className={'btn btn-icon' + (settings.magnetMode ? ' record' : '')}
             onClick={() => togglePlay()}
             title='Play/Pause (SPASE)'>
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </div>
        <div className='separator'></div>
        <div className={'btn btn-icon focus' + (recording ? ' record' : '')}
             onMouseDown={() => startRecording(window.currentTime)}
             title='Hold to record subtitle'>
          <FontAwesomeIcon icon={faStop} />
        </div>
      </div>
      <div className='duration-container'>
        <TimeIndicator player={player} />
      </div>
    </Style>
  );
}
