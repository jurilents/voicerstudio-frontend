import styled from 'styled-components';
import languages from '../../libs/languages';
import { t, Translate } from 'react-i18nify';
import React, { useCallback, useEffect, useState } from 'react';
import { download, getExt } from '../../utils';
import { file2sub, sub2srt, sub2txt, sub2vtt } from '../../libs/readSub';
import sub2ass from '../../libs/readSub/sub2ass';
import googleTranslate from '../../libs/googleTranslate';
import FFmpeg from '@ffmpeg/ffmpeg';
import SimpleFS from '@forlagshuset/simple-fs';
import { Nav, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleQuestion,
  faCloudArrowDown,
  faFileImport,
  faHeadphonesAlt,
  faHouseChimney,
  faLanguage,
  faRobot,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import GeneralTab from './tabs/GeneralTab';
import MixerTab from './tabs/MixerTab';
import ExportTab from './tabs/ExportTab';
import HelpTab from './tabs/HelpTab';
import SpeakersTab from './tabs/SpeakersTab';

const Style = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  //padding-bottom: 15px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 50%);
  border-left: 1px solid rgb(255 255 255 / 20%);
  max-width: 400px;

  .tab-content {
    min-height: 130px;
    padding: 10px 10px 20px 10px;
    height: 100%;
  }

  .tab-pane {
    height: 100%;
  }

  .tabs-buttons {
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    .nav-link {
      cursor: pointer;
      border-radius: 0;
      padding: 10px 12px;
      color: white;

      &.active {
        background-color: var(--c-primary);
      }
    }
  }

  h3 {
    border-bottom: 1px solid rgb(255 255 255 / 30%);
    padding-bottom: 5px;
    margin-bottom: 20px;
    font-size: 20px;
    text-align: center;
  }

  .import {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    gap: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    .btn {
      background-color: var(--c-primary);
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
`;

FFmpeg.createFFmpeg({ log: process.env.REACT_APP_LOG_FFMPEG === 'true' }).load();
const fs = new SimpleFS.FileSystem();

export default function Toolbar(props) {
  const [translate, setTranslate] = useState('en');
  const [videoFile, setVideoFile] = useState(null);

  const decodeAudioData = useCallback(
    async (file) => {
      try {
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ log: true });
        ffmpeg.setProgress(({ ratio }) => props.setProcessing(ratio * 100));
        props.setLoading(t('LOADING_FFMPEG'));
        await ffmpeg.load();
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        props.setLoading('');
        props.notify({
          message: t('DECODE_START'),
          level: 'info',
        });
        const output = `${Date.now()}.mp3`;
        await ffmpeg.run('-i', file.name, '-ac', '1', '-ar', '8000', output);
        const uint8 = ffmpeg.FS('readFile', output);
        // download(URL.createObjectURL(new Blob([uint8])), `${output}`);
        await props.waveform.decoder.decodeAudioData(uint8);
        props.waveform.drawer.update();
        props.setProcessing(0);
        ffmpeg.setProgress(() => null);
        props.notify({
          message: t('DECODE_SUCCESS'),
          level: 'success',
        });
      } catch (error) {
        props.setLoading('');
        props.setProcessing(0);
        props.notify({
          message: t('DECODE_ERROR'),
          level: 'error',
        });
      }
    },
    [props.waveform, props.notify, props.setProcessing, props.setLoading],
  );

  const burnSubtitles = useCallback(async () => {
    try {
      const { createFFmpeg, fetchFile } = FFmpeg;
      const ffmpeg = createFFmpeg({ log: true });
      ffmpeg.setProgress(({ ratio }) => props.setProcessing(ratio * 100));
      props.setLoading(t('LOADING_FFMPEG'));
      await ffmpeg.load();
      props.setLoading(t('LOADING_FONT'));

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
      props.setLoading(t('LOADING_VIDEO'));
      ffmpeg.FS(
        'writeFile',
        videoFile ? videoFile.name : 'samples/sample.mp4',
        await fetchFile(videoFile || 'samples/sample.mp4'),
      );
      props.setLoading(t('LOADING_SUB'));
      const subtitleFile = new File([new Blob([sub2ass(props.subtitle)])], 'subtitle.ass');
      ffmpeg.FS('writeFile', subtitleFile.name, await fetchFile(subtitleFile));
      props.setLoading('');
      props.notify({
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
      props.setProcessing(0);
      ffmpeg.setProgress(() => null);
      props.notify({
        message: t('BURN_SUCCESS'),
        level: 'success',
      });
    } catch (error) {
      props.setLoading('');
      props.setProcessing(0);
      props.notify({
        message: t('BURN_ERROR'),
        level: 'error',
      });
    }
  }, [props.notify, props.setProcessing, props.setLoading, videoFile, props.subtitle]);

  const onVideoChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const ext = getExt(file.name);
        const canPlayType = props.player.canPlayType(file.type);
        if (canPlayType === 'maybe' || canPlayType === 'probably') {
          setVideoFile(file);
          decodeAudioData(file);
          const url = URL.createObjectURL(new Blob([file]));
          props.waveform.decoder.destroy();
          props.waveform.drawer.update();
          props.waveform.seek(0);
          props.player.currentTime = 0;
          props.clearSubs();
          props.setSubtitle([
            props.newSub({
              start: '00:00:00.000',
              end: '00:00:01.000',
              text: t('SUB_TEXT'),
            }),
          ]);
          props.player.src = url;
        } else {
          props.notify({
            message: `${t('VIDEO_EXT_ERR')}: ${file.type || ext}`,
            level: 'error',
          });
        }
      }
    },
    [props.newSub, props.notify, props.player, props.setSubtitle, props.waveform, props.clearSubs, decodeAudioData],
  );

  const onSubtitleChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const ext = getExt(file.name);
        if (['ass', 'vtt', 'srt', 'json'].includes(ext)) {
          file2sub(file)
            .then((res) => {
              props.clearSubs();
              props.setSubtitle(res);
            })
            .catch((err) => {
              props.notify({
                message: err.message,
                level: 'error',
              });
            });
        } else {
          props.notify({
            message: `${t('SUB_EXT_ERR')}: ${ext}`,
            level: 'error',
          });
        }
      }
    },
    [props.notify, props.setSubtitle, props.clearSubs],
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
          text = sub2vtt(props.subtitle);
          break;
        case 'srt':
          text = sub2srt(props.subtitle);
          break;
        case 'ass':
          text = sub2ass(props.subtitle);
          break;
        case 'txt':
          text = sub2txt(props.subtitle);
          break;
        case 'json':
          text = JSON.stringify(props.subtitle);
          break;
        default:
          break;
      }
      const url = URL.createObjectURL(new Blob([text]));
      download(url, name);
    },
    [props.subtitle],
  );

  const onTranslate = useCallback(() => {
    props.setLoading(t('TRANSLATING'));
    googleTranslate(props.formatSub(props.subtitle), translate)
      .then((res) => {
        props.setLoading('');
        props.setSubtitle(props.formatSub(res));
        props.notify({
          message: t('TRANSLAT_SUCCESS'),
          level: 'success',
        });
      })
      .catch((err) => {
        props.setLoading('');
        props.notify({
          message: err.message,
          level: 'error',
        });
      });
  }, [props.subtitle, props.setLoading, props.formatSub, props.setSubtitle, props.translate, props.notify]);

  const onDocumentMouseUp = useCallback(() => {
    if (props.recording) {
      props.setRecording(false);
    }
  }, [props.recording, props.setRecording]);

  useEffect(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    return () => {
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };
  }, [onDocumentMouseUp]);

  return (
    <Style className='tool noselect'>
      <Tab.Container id='left-tabs-example' defaultActiveKey='speakers'>
        <Nav variant='pills' className='tabs-buttons'>
          <Nav.Item>
            <Nav.Link as='span' eventKey='general' title='General'>
              <FontAwesomeIcon icon={faHouseChimney} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='presets' title='Voice Presets'>
              <FontAwesomeIcon icon={faRobot} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='speakers' title='Speakers'>
              <FontAwesomeIcon icon={faUsers} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='mixer' title='Mixer'>
              <FontAwesomeIcon icon={faHeadphonesAlt} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='translate' title='Translate'>
              <FontAwesomeIcon icon={faLanguage} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='import' title='Import'>
              <FontAwesomeIcon icon={faFileImport} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='export' title='Export'>
              <FontAwesomeIcon icon={faCloudArrowDown} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='help' title='Help'>
              <FontAwesomeIcon icon={faCircleQuestion} />
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey='general'>
            <GeneralTab {...props} />
          </Tab.Pane>
          <Tab.Pane eventKey='speakers'>
            <SpeakersTab {...props} />
          </Tab.Pane>
          <Tab.Pane eventKey='mixer'>
            <MixerTab {...props} />
          </Tab.Pane>
          <Tab.Pane eventKey='translate'>
            <div className='translate'>
              <select value={translate} onChange={(event) => setTranslate(event.target.value)}>
                {(languages[props.language] || languages.en).map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className='btn' onClick={onTranslate}>
                <Translate value='TRANSLATE' />
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey='import'>
            {/*<div className='import'>*/}
            {/*<div className='btn secondary' onClick={() => downloadSub('json')}>*/}
            {/*  <Translate value='EXPORT_JSON' />*/}
            {/*</div>*/}
            {/*<div className='btn secondary' onClick={() => downloadSub('srt')}>*/}
            {/*  <Translate value='EXPORT_SRT' />*/}
            {/*</div>*/}
            {/*<div className='btn'>*/}
            {/*  <Translate value='OPEN_VIDEO' />*/}
            {/*  <input className='file' type='file' onChange={onVideoChange} onClick={onInputClick} />*/}
            {/*</div>*/}
          </Tab.Pane>
          <Tab.Pane eventKey='export'>
            <ExportTab {...props} />
          </Tab.Pane>
          <Tab.Pane eventKey='help'>
            <HelpTab {...props} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>


      {/*<div className='import'>*/}
      {/*<div className='btn secondary' onClick={() => downloadSub('json')}>*/}
      {/*  <Translate value='EXPORT_JSON' />*/}
      {/*</div>*/}
      {/*<div className='btn secondary' onClick={() => downloadSub('srt')}>*/}
      {/*  <Translate value='EXPORT_SRT' />*/}
      {/*</div>*/}
      {/*<div className='btn'>*/}
      {/*  <Translate value='OPEN_VIDEO' />*/}
      {/*  <input className='file' type='file' onChange={onVideoChange} onClick={onInputClick} />*/}
      {/*</div>*/}
      {/*</div>*/}
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
    </Style>
  );
}
