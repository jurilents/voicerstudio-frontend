import { t } from 'react-i18nify';
import React, { memo, useCallback, useEffect, useState } from 'react';
import googleTranslate from '../../libs/googleTranslate';
import { Nav, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faCircleQuestion,
  faCloudArrowDown,
  faCloudArrowUp,
  faHeadphonesAlt,
  faHouseChimney,
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
import { toast } from 'react-toastify';
import MarkersTab from './tabs/MarkersTab';


// FFmpeg.createFFmpeg({ log: process.env.REACT_APP_LOG_FFMPEG === 'true' }).load();
// const fs = new SimpleFS.FileSystem();

const Toolbar = (props) => {
  // const singleRecordMode = useSelector(store => store.settings.singleRecordMode);
  const [translate, setTranslate] = useState('en');
  // const [videoFile, setVideoFile] = useState(null);

  const onTranslate = useCallback(() => {
    props.setLoading(t('TRANSLATING'));
    googleTranslate(props.formatSub(props.subtitle), translate)
      .then((res) => {
        props.setLoading('');
        // props.setSubtitle(props.formatSub(res));
        toast.error(t('TRANSLAT_SUCCESS'));
      })
      .catch((err) => {
        props.setLoading('');
        props.notify({
          message: err.message,
          level: 'error',
        });
      });
  }, [props.subtitle, props.setLoading, props.translate, props.notify]);

  const onDocumentMouseUp = useCallback(() => {
    if (props.recording) {
      props.setRecording(false);
      // if (singleRecordMode) {
      props.setPlaying(false);
      if (!props.player.paused)
        props.player.pause();
      // }
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
      <Tab.Container id='left-tabs-example' defaultActiveKey='presets'>
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
            <Nav.Link as='span' eventKey='markers' title='Markers'>
              <FontAwesomeIcon icon={faBookmark} />
            </Nav.Link>
          </Nav.Item>
          {/*<Nav.Item>*/}
          {/*  <Nav.Link as='span' eventKey='translate' title='Translate'>*/}
          {/*    <FontAwesomeIcon icon={faLanguage} />*/}
          {/*  </Nav.Link>*/}
          {/*</Nav.Item>*/}
          <Nav.Item>
            <Nav.Link as='span' eventKey='import' title='Import'>
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='export' title='Export'>
              <FontAwesomeIcon icon={faCloudArrowDown} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as='span' eventKey='help' title='Hotkeys & Help'>
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
          <Tab.Pane eventKey='markers'>
            <MarkersTab {...props} />
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
    </Style>
  );
};

export default memo(
  Toolbar,
  (prevProps, nextProps) => {
    return nextProps.player && prevProps.player?.src === nextProps.player?.src;
  },
);
