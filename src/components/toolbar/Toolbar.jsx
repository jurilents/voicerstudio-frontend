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
import PresetsTab from './tabs/PresetsTab';
import { Style } from './Toolbar.styles';
import ImportTab from './tabs/ImportTab';
import { useSelector } from 'react-redux';


FFmpeg.createFFmpeg({ log: process.env.REACT_APP_LOG_FFMPEG === 'true' }).load();
// const fs = new SimpleFS.FileSystem();

export default function Toolbar(props) {
  const singleRecordMode = useSelector(store => store.settings.singleRecordMode);
  const [translate, setTranslate] = useState('en');
  // const [videoFile, setVideoFile] = useState(null);

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
      if (singleRecordMode) {
        props.setPlaying(false);
        props.player.pause();
      }
    }
  }, [props.recording, props.setRecording, singleRecordMode]);

  useEffect(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    return () => {
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };
  }, [onDocumentMouseUp]);

  return (
    <Style className='tool noselect'>
      <Tab.Container id='left-tabs-example' defaultActiveKey='general'>
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
          <Tab.Pane eventKey='presets'>
            <PresetsTab {...props} />
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
            <ImportTab {...props} />
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
