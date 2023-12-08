import styled from 'styled-components';
import {
  faCircle,
  faEarthAmericas,
  faMagnet,
  faPause,
  faPlay,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import TimeIndicator from './TimeIndicator';
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {usePlayerControls} from '../../hooks/usePlayerControls';
import {setTimelineSettings} from '../../store/timelineSettingsReducer';
import {borderRadius} from '../../styles/constants';
import palette from '../../styles/palette';
import {useTranslator, useVoicer} from '../../hooks';
import {useTranslation} from 'react-i18next';

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
    border-radius: ${borderRadius};
  }

  .btn {
    background: transparent;
    padding-left: 20px;
    padding-right: 20px;
    opacity: 100%;
    color: white;

    &.active {
      background-color: ${palette.colors.primary};
    }
  }

  .label {
    display: inline-block;
    margin-left: 6px;
    font-size: 14px;
    opacity: 66%;
  }

  .btn-text {
    min-width: 70px;
    padding: 6px;
    display: flex;

    svg, .label {
      color: ${palette.colors.text} !important;
    }
  }

  .filler {
    width: 50px;
  }
`;

const Actions = () => {
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player.videoPlayer);
  const settings = useSelector((store) => store.timelineSettings);
  const {playing, recording} = useSelector((store) => store.timeline);
  const {startRecording, completeRecording, togglePlay, pause} = usePlayerControls(player);
  const {speakAll} = useVoicer();
  const {translateAll} = useTranslator();
  const {t} = useTranslation();

  useEffect(() => {
    document.addEventListener('mouseup', completeRecording);
    return () => document.removeEventListener('mouseup', completeRecording);
  }, [completeRecording]);

  const patchSettings = useCallback(
    (patch) => {
      pause();
      dispatch(setTimelineSettings(patch));
    },
    [pause, dispatch],
  );

  return (
    <Style className="actions-wrapper">
      <div className="actions-container">
        <div
          className="btn btn-icon refresh-translations-btn focus"
          onClick={() => translateAll()}
          title={t('tabs.general.refreshTranslations')}>
          <FontAwesomeIcon icon={faEarthAmericas}/>
        </div>
        <div
          className="btn btn-icon speak-all-btn focus"
          onClick={() => speakAll({speed: 0})}
          title={t('tabs.general.speakAll')}>
          <FontAwesomeIcon icon={faWandMagicSparkles}/>
        </div>
        <div
          className={'btn btn-icon magnet-btn focus' + (settings.magnetMode ? ' active' : '')}
          onClick={() => patchSettings({magnetMode: !settings.magnetMode})}
          title="Navigation lines">
          <FontAwesomeIcon icon={faMagnet}/>
        </div>
        {/*<div*/}
        {/*  className={'btn btn-icon fixed-timestamps-btn focus' + (settings.scrollableMode ? ' active' : '')}*/}
        {/*  onClick={() => patchSettings({scrollableMode: !settings.scrollableMode})}*/}
        {/*  title="Move by fixed timesteps"*/}
        {/*>*/}
        {/*  <FontAwesomeIcon icon={faLocationCrosshairs}/>*/}
        {/*</div>*/}
        <div className="separator"></div>
        <div
          className="btn btn-icon play-pause-btn"
          onClick={() => togglePlay()}
          title="Play/Pause (SPASE)">
          <FontAwesomeIcon icon={playing ? faPause : faPlay}/>
        </div>
        <div className="separator"></div>
        <div
          className={'btn btn-icon btn-text record-btn focus' + (recording ? ' record' : '')}
          onMouseDown={() => startRecording(window.currentTime)}
          title="Hold to record subtitle">
          <FontAwesomeIcon icon={faCircle} style={{fontSize: '16px'}}/>
          <span className="label">REC</span>
        </div>
        <div className="filler"></div>
      </div>
      <div className="duration-container">
        <TimeIndicator player={player}/>
      </div>
    </Style>
  );
};

export default Actions;
