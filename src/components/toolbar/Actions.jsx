import styled from 'styled-components';
import { faLocationCrosshairs, faMagnet, faPause, faPencil, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { speechApi } from '../../api/axios';
import { download } from '../../utils';
import { useSettings } from '../../hooks';

const Style = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  gap: 10px;

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
    playing,
    setPlaying,
    recording,
    setRecording,
    player,
    subtitle,
    speakers,
  }) {
  const { settings, patchSettings } = useSettings();

  const startRecording = () => {
    setRecording(true);
    setPlaying(true);
    player.play();
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      player.pause();
    } else {
      setPlaying(true);
      player.play();
    }
  };

  const generateAndDownloadFinal = useCallback(() => {
    async function fetch() {
      const speaker = speakers.find(x => x.id === settings.currentSpeaker);
      const speakerSubs = subtitle.filter(x => x.speaker === speaker.id);
      const request = speakerSubs.map(sub => ({
        locale: speaker.locale,
        voice: speaker.voice,
        text: sub.text,
        style: speaker.speechConfig[3],
        styleDegree: +speaker.speechConfig[4],
        // role: 'string',
        pitch: +speaker.speechConfig[5],
        volume: +speaker.speechConfig[6],
        start: sub.start,
        end: sub.end,
      }));
      console.log('Batch speech request:', request);
      const audio = await speechApi.batch(request, 'test');
      console.log('result audio url', audio);
      download(audio.url, `[${speaker.id}] output.wav`);
    }

    fetch();
  }, [speakers, subtitle, settings.currentSpeaker]);

  return (
    <Style className='actions'>
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
      {/*<div className={'btn btn-icon focus' + (settings.magnet ? ' record' : '')}*/}
      {/*     onClick={() => generateAndDownloadFinal()}>*/}
      {/*  <FontAwesomeIcon icon={faCloudDownload} />*/}
      {/*</div>*/}
      <div className={'btn btn-icon focus' + (recording ? ' record' : '')}
           onMouseDown={() => startRecording()}>
        <FontAwesomeIcon icon={faStop} />
      </div>
    </Style>
  );
}
