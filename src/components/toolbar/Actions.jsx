import styled from 'styled-components';
import { faLocationCrosshairs, faMagnet, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Duration from '../timeline/Duration';
import React, { useCallback, useEffect } from 'react';
import { setPlaying } from '../../store/timelineReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../store/settingsReducer';
import { Sub } from '../../models';
import { t } from 'react-i18nify';
import { addSub, patchSub, removeSub } from '../../store/sessionReducer';

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
  const settings = useSelector(store => store.settings);
  const { selectedSpeaker } = useSelector(store => store.session);
  const { playing, recording, time } = useSelector(store => store.timeline);

  const startRecording = () => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    if (!playing) {
      // dispatch(setPlaying(true));
      // if (player?.paused) player.play();
      // engine.play({ autoEnd: true });
      togglePlay();
      console.log('play!');
    }

    const sub = new Sub({
      speakerId: selectedSpeaker.id,
      start: time,
      end: time,
      text: t('SUB_TEXT'),
    });
    sub.recording = true;

    console.log('starting recording...');
    // sub.startOffset = ;
    // dispatch(setRecordingSub(sub));
    window.recordingSub = sub;
    dispatch(addSub(sub));

    setTimeout(() => engine.play({ autoEnd: true }), 10);
  };

  const completeRecording = useCallback(() => {
    if (window.recordingSub) {
      const recSub = window.recordingSub;
      if (recSub.end - recSub.start > 0.5) {
        dispatch(patchSub(recSub, { end: recSub.end }));
      } else {
        dispatch(removeSub(recSub));
        if (!player.paused) player.pause();
        if (window.timelineEngine) window.timelineEngine.pause();
      }
    }
    delete window.recordingSub;
  }, [window.recordingSub, dispatch]);

  useEffect(() => {
    document.addEventListener('mouseup', completeRecording);
    return () => document.removeEventListener('mouseup', completeRecording);
  }, [completeRecording]);

  const togglePlay = () => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    if (playing) {
      dispatch(setPlaying(false));
      if (!player.paused) player.pause();
      engine.pause();
    } else {
      dispatch(setPlaying(true));
      if (player.paused) player.play();
      engine.play({ autoEnd: true });
    }
  };

  const patchSettings = useCallback((patch) => {
    dispatch(setSettings(patch));
  }, [dispatch]);


  return (
    <Style className='actions-wrapper'>
      <div className='actions-container'>
        {/*<div className={'btn btn-icon focus' + (settings.drawingMode ? ' active' : '')}*/}
        {/*     onClick={() => patchSettings({ drawingMode: !settings.drawingMode })}>*/}
        {/*  <FontAwesomeIcon icon={faPencil} />*/}
        {/*</div>*/}
        <div className={'btn btn-icon focus' + (settings.scrollableMode ? ' active' : '')}
             onClick={() => patchSettings({ scrollableMode: !settings.scrollableMode })}
             title='Navigation lines'>
          <FontAwesomeIcon icon={faLocationCrosshairs} />
        </div>
        <div className={'btn btn-icon focus' + (settings.magnetMode ? ' active' : '')}
             onClick={() => patchSettings({ magnetMode: !settings.magnetMode })}
             title='Move by fixed timesteps'>
          <FontAwesomeIcon icon={faMagnet} />
        </div>
        <div className='separator'></div>
        <div className={'btn btn-icon' + (settings.magnetMode ? ' record' : '')}
             onClick={() => togglePlay()}
             title='Play/Pause (SPASE)'>
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </div>
        <div className='separator'></div>
        <div className={'btn btn-icon focus' + (recording ? ' record' : '')}
             onMouseDown={() => startRecording()}
             title='Hold to record subtitle'>
          <FontAwesomeIcon icon={faStop} />
        </div>
      </div>
      <div className='duration-container'>
        <Duration currentTime={time} player={player} />
      </div>
    </Style>
  );
}
