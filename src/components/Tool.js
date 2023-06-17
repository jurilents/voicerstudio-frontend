import styled from 'styled-components';
import languages from '../libs/languages';
import { t, Translate } from 'react-i18nify';
import React, { useCallback, useEffect, useState } from 'react';
import { download, getExt, getWaveformZoomSteps } from '../utils';
import { file2sub, sub2srt, sub2txt, sub2vtt } from '../libs/readSub';
import sub2ass from '../libs/readSub/sub2ass';
import googleTranslate from '../libs/googleTranslate';
import FFmpeg from '@ffmpeg/ffmpeg';
import SimpleFS from '@forlagshuset/simple-fs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs, faMagnet, faPause, faPlay, faRocket, faStop } from '@fortawesome/free-solid-svg-icons';

const Style = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 50%);
  border-left: 1px solid rgb(255 255 255 / 20%);

  .import {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    gap: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    .btn {
      background-color: #3f51b5;
    }

    .secondary {
      background-color: #009688;
    }

    .file {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .burn {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    .btn {
      background-color: #673ab7;
    }
  }

  .export {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);
  }

  .operate {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    .btn {
      width: 48%;
      background-color: #009688;
    }
  }

  .translate {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    select {
      width: 65%;
      outline: none;
      padding: 0 5px;
      border-radius: 3px;
    }

    .btn {
      width: 33%;
      background-color: #673ab7;
    }
  }

  .hotkey {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    span {
      width: 49%;
      font-size: 13px;
      padding: 5px 0;
      border-radius: 3px;
      text-align: center;
      color: rgb(255 255 255 / 75%);
      background-color: rgb(255 255 255 / 20%);
    }
  }

  .bottom {
    padding: 10px;

    a {
      display: flex;
      flex-direction: column;
      border: 1px solid rgb(255 255 255 / 30%);
      text-decoration: none;

      .title {
        color: #ffeb3b;
        padding: 5px 10px;
        animation: animation 3s infinite;
        border-bottom: 1px solid rgb(255 255 255 / 30%);
      }

      @keyframes animation {
        50% {
          color: #00bcd4;
        }
      }

      img {
        max-width: 100%;
      }
    }
  }

  .progress {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 9;
    height: 2px;
    background-color: rgb(0 0 0 / 50%);

    span {
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0;
      height: 100%;
      background-color: #ff9800;
      transition: all 0.2s ease 0s;
    }
  }

  .btn.active {
    background-color: #3f51b5;
  }

  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    gap: 10px;

    .btn {
      font-size: 18px;
      max-width: 40px;

      &.focus:active:hover {
        background-color: #c22213;
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
  }
`;

FFmpeg.createFFmpeg({ log: process.env.REACT_APP_LOG_FFMPEG === 'true' }).load();
const fs = new SimpleFS.FileSystem();

export default function Header(
  {
    playing,
    setPlaying,
    recording,
    setRecording,
    player,
    waveform,
    newSub,
    undoSubs,
    clearSubs,
    language,
    subtitle,
    setLoading,
    formatSub,
    setSubtitle,
    setProcessing,
    notify,
    settings,
    setSettings,
  }) {
  const [translate, setTranslate] = useState('en');
  const [videoFile, setVideoFile] = useState(null);

  const decodeAudioData = useCallback(
    async (file) => {
      try {
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ log: true });
        ffmpeg.setProgress(({ ratio }) => setProcessing(ratio * 100));
        setLoading(t('LOADING_FFMPEG'));
        await ffmpeg.load();
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        setLoading('');
        notify({
          message: t('DECODE_START'),
          level: 'info',
        });
        const output = `${Date.now()}.mp3`;
        await ffmpeg.run('-i', file.name, '-ac', '1', '-ar', '8000', output);
        const uint8 = ffmpeg.FS('readFile', output);
        // download(URL.createObjectURL(new Blob([uint8])), `${output}`);
        await waveform.decoder.decodeAudioData(uint8);
        waveform.drawer.update();
        setProcessing(0);
        ffmpeg.setProgress(() => null);
        notify({
          message: t('DECODE_SUCCESS'),
          level: 'success',
        });
      } catch (error) {
        setLoading('');
        setProcessing(0);
        notify({
          message: t('DECODE_ERROR'),
          level: 'error',
        });
      }
    },
    [waveform, notify, setProcessing, setLoading],
  );

  const burnSubtitles = useCallback(async () => {
    try {
      const { createFFmpeg, fetchFile } = FFmpeg;
      const ffmpeg = createFFmpeg({ log: true });
      ffmpeg.setProgress(({ ratio }) => setProcessing(ratio * 100));
      setLoading(t('LOADING_FFMPEG'));
      await ffmpeg.load();
      setLoading(t('LOADING_FONT'));

      await fs.mkdir('/fonts');
      const fontExist = await fs.exists('/fonts/Microsoft-YaHei.ttf');
      if (fontExist) {
        const fontBlob = await fs.readFile('/fonts/Microsoft-YaHei.ttf');
        ffmpeg.FS('writeFile', `tmp/Microsoft-YaHei.ttf`, await fetchFile(fontBlob));
      } else {
        const fontUrl = 'https://cdn.jsdelivr.net/gh/zhw2590582/SubPlayer/docs/Microsoft-YaHei.ttf';
        const fontBlob = await fetch(fontUrl).then((res) => res.blob());
        await fs.writeFile('/fonts/Microsoft-YaHei.ttf', fontBlob);
        ffmpeg.FS('writeFile', `tmp/Microsoft-YaHei.ttf`, await fetchFile(fontBlob));
      }
      setLoading(t('LOADING_VIDEO'));
      ffmpeg.FS(
        'writeFile',
        videoFile ? videoFile.name : 'sample.mp4',
        await fetchFile(videoFile || 'sample.mp4'),
      );
      setLoading(t('LOADING_SUB'));
      const subtitleFile = new File([new Blob([sub2ass(subtitle)])], 'subtitle.ass');
      ffmpeg.FS('writeFile', subtitleFile.name, await fetchFile(subtitleFile));
      setLoading('');
      notify({
        message: t('BURN_START'),
        level: 'info',
      });
      const output = `${Date.now()}.mp4`;
      await ffmpeg.run(
        '-i',
        videoFile ? videoFile.name : 'sample.mp4',
        '-vf',
        `ass=${subtitleFile.name}:fontsdir=/tmp`,
        '-preset',
        videoFile ? 'fast' : 'ultrafast',
        output,
      );
      const uint8 = ffmpeg.FS('readFile', output);
      download(URL.createObjectURL(new Blob([uint8])), `${output}`);
      setProcessing(0);
      ffmpeg.setProgress(() => null);
      notify({
        message: t('BURN_SUCCESS'),
        level: 'success',
      });
    } catch (error) {
      setLoading('');
      setProcessing(0);
      notify({
        message: t('BURN_ERROR'),
        level: 'error',
      });
    }
  }, [notify, setProcessing, setLoading, videoFile, subtitle]);

  const onVideoChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const ext = getExt(file.name);
        const canPlayType = player.canPlayType(file.type);
        if (canPlayType === 'maybe' || canPlayType === 'probably') {
          setVideoFile(file);
          decodeAudioData(file);
          const url = URL.createObjectURL(new Blob([file]));
          waveform.decoder.destroy();
          waveform.drawer.update();
          waveform.seek(0);
          player.currentTime = 0;
          clearSubs();
          setSubtitle([
            newSub({
              start: '00:00:00.000',
              end: '00:00:01.000',
              text: t('SUB_TEXT'),
            }),
          ]);
          player.src = url;
        } else {
          notify({
            message: `${t('VIDEO_EXT_ERR')}: ${file.type || ext}`,
            level: 'error',
          });
        }
      }
    },
    [newSub, notify, player, setSubtitle, waveform, clearSubs, decodeAudioData],
  );

  const onSubtitleChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const ext = getExt(file.name);
        if (['ass', 'vtt', 'srt', 'json'].includes(ext)) {
          file2sub(file)
            .then((res) => {
              clearSubs();
              setSubtitle(res);
            })
            .catch((err) => {
              notify({
                message: err.message,
                level: 'error',
              });
            });
        } else {
          notify({
            message: `${t('SUB_EXT_ERR')}: ${ext}`,
            level: 'error',
          });
        }
      }
    },
    [notify, setSubtitle, clearSubs],
  );

  const onInputClick = useCallback((event) => {
    event.target.value = '';
  }, []);

  const downloadSub = useCallback(
    (type) => {
      let text = '';
      const name = `${Date.now()}.${type}`;
      switch (type) {
        case 'vtt':
          text = sub2vtt(subtitle);
          break;
        case 'srt':
          text = sub2srt(subtitle);
          break;
        case 'ass':
          text = sub2ass(subtitle);
          break;
        case 'txt':
          text = sub2txt(subtitle);
          break;
        case 'json':
          text = JSON.stringify(subtitle);
          break;
        default:
          break;
      }
      const url = URL.createObjectURL(new Blob([text]));
      download(url, name);
    },
    [subtitle],
  );

  const onTranslate = useCallback(() => {
    setLoading(t('TRANSLATING'));
    googleTranslate(formatSub(subtitle), translate)
      .then((res) => {
        setLoading('');
        setSubtitle(formatSub(res));
        notify({
          message: t('TRANSLAT_SUCCESS'),
          level: 'success',
        });
      })
      .catch((err) => {
        setLoading('');
        notify({
          message: err.message,
          level: 'error',
        });
      });
  }, [subtitle, setLoading, formatSub, setSubtitle, translate, notify]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      player.pause();
    } else {
      setPlaying(true);
      player.play();
    }
  };

  const startRecording = () => {
    setRecording(true);
    setPlaying(true);
    player.play();
  };

  const onDocumentMouseUp = useCallback(() => {
    if (recording) {
      setRecording(false);
    }
  }, [recording, setRecording]);

  useEffect(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    return () => {
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };
  }, [onDocumentMouseUp]);

  return (
    <Style className='tool'>
      <div className='top'>
        <div className='import'>
          <div className='btn secondary' onClick={() => downloadSub('json')}>
            <Translate value='EXPORT_JSON' />
          </div>
          <div className='btn secondary' onClick={() => downloadSub('srt')}>
            <Translate value='EXPORT_SRT' />
          </div>
          <div className='btn'>
            <Translate value='OPEN_VIDEO' />
            <input className='file' type='file' onChange={onVideoChange} onClick={onInputClick} />
          </div>
        </div>
        {/*{window.crossOriginIsolated ? (*/}
        {/*  <div className='burn' onClick={burnSubtitles}>*/}
        {/*    <div className='btn'>*/}
        {/*      <Translate value='EXPORT_VIDEO' />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*) : null}*/}
        {/*<div className='operate'>*/}
        {/*  <div*/}
        {/*    className='btn'*/}
        {/*    onClick={() => {*/}
        {/*      if (window.confirm(t('CLEAR_TIP')) === true) {*/}
        {/*        clearSubs();*/}
        {/*        window.location.reload();*/}
        {/*      }*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <Translate value='CLEAR' />*/}
        {/*  </div>*/}
        {/*  <div className='btn' onClick={undoSubs}>*/}
        {/*    <Translate value='UNDO' />*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className='translate'>
          <select value={translate} onChange={(event) => setTranslate(event.target.value)}>
            {(languages[language] || languages.en).map((item) => (
              <option key={item.key} value={item.key}>
                {item.name}
              </option>
            ))}
          </select>
          <div className='btn' onClick={onTranslate}>
            <Translate value='TRANSLATE' />
          </div>
        </div>
        {/*<div className='hotkey'>*/}
        {/*  <span>*/}
        {/*      <Translate value='HOTKEY_01' />*/}
        {/*  </span>*/}
        {/*  <span>*/}
        {/*      <Translate value='HOTKEY_02' />*/}
        {/*  </span>*/}
        {/*</div>*/}
        <div className='hotkey'>
          <input type='range' min={1} max={getWaveformZoomSteps(waveform)} value={settings.zoom}
                 onChange={(e) => {
                   setSettings({ zoom: e.target.value });
                 }} />
        </div>
        <div className='actions'>
          <div className={'btn btn-icon focus' + (settings.scrollable ? ' active' : '')}
               onClick={() => setSettings({ scrollable: !settings.scrollable })}>
            <FontAwesomeIcon icon={faLocationCrosshairs} />
          </div>
          <div className={'btn btn-icon focus' + (settings.magnet ? ' active' : '')}
               onClick={() => setSettings({ magnet: !settings.magnet })}>
            <FontAwesomeIcon icon={faMagnet} />
          </div>
          <div className='separator'></div>
          <div className={'btn btn-icon' + (settings.magnet ? ' record' : '')}
               onClick={() => togglePlay()} title='Hotkey: SPASE'>
            <FontAwesomeIcon icon={playing ? faPause : faPlay} />
          </div>
          <div className='separator'></div>
          <div className={'btn btn-icon focus' + (settings.magnet ? ' record' : '')}
               onClick={() => setSettings({ magnet: !settings.magnet })}>
            <FontAwesomeIcon icon={faRocket} />
          </div>
          <div className={'btn btn-icon focus' + (recording ? ' record' : '')}
               onMouseDown={() => startRecording()}>
            <FontAwesomeIcon icon={faStop} />
          </div>
        </div>
      </div>
    </Style>
  );
}
