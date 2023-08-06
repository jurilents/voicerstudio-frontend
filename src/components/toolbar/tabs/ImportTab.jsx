import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { downloadObjectAsJson, getExt } from '../../../utils';
import { restoreFromJson, setVideo } from '../../../store/sessionReducer';
import { t } from 'react-i18nify';
import { useVideoStorage } from '../../../hooks';
import { toast } from 'react-toastify';
import { dropDatabase } from '../../../hooks/openDatabase';

const Style = styled.div`
  .file {
    border-radius: 1px;
    background-color: transparent;
    color: white;
    border: 1px solid rgb(255 255 255 / 25%);

    &::file-selector-button {
      background-color: rgb(255 255 255 / 10%);
      color: white;
    }

    &:hover {
      &::file-selector-button {
        background-color: rgb(255 255 255 / 25%) !important;
      }
    }
  }
`;

let resetCountdown = 5;

export default function ImportTab(props) {
  const dispatch = useDispatch();
  const session = useSelector(store => store.session);
  const { saveVideo } = useVideoStorage();

  const onVideoChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const ext = getExt(file.name);
      const canPlayType = props.player.canPlayType(file.type);
      if (canPlayType === 'maybe' || canPlayType === 'probably') {
        toast.info('Video is uploading...');
        saveVideo('video1', file).then(() => {
          const url = URL.createObjectURL(new Blob([file]));
          props.player.currentTime = 0;
          dispatch(setVideo(url));
          toast.success('Video uploaded! Refreshing the page...');
          setTimeout(() => window.location.reload(), 1000);
        });
      } else {
        toast.error(`${t('VIDEO_EXT_ERR')}: ${file.type || ext}`);
      }
    }
  }, [dispatch, props.notify, props.player]);

  const onInputClick = useCallback((event) => {
    event.target.value = '';
  }, []);

  const onBackupFileLoad = (event) => {
    dispatch(restoreFromJson(event.target.result));
  };

  const restoreFromBackupFile = (event) => {

    const file = event.target.files[0];
    if (file) {
      const ext = getExt(file.name);
      if (ext !== 'json') {
        toast.warn('Invalid backup file format');
        return;
      }
      const reader = new FileReader();
      reader.onload = onBackupFileLoad;
      reader.readAsText(file);
    }
  };

  const saveBackupFile = () => {
    const tz = new Date().getTimezoneOffset() * 60000;
    const date = new Date(Date.now() - tz).toISOString().substring(0, 16).replaceAll(':', '-').replace('T', ' ');
    const filename = `voicerbackup-${date}`;

    downloadObjectAsJson(session, filename);
  };

  const handleResetClick = () => {
    if (resetCountdown === 0) {
      localStorage.clear();
      dropDatabase().then(() => {
        window.location.reload();
      });
      return;
    }

    toast.warn(`If you really want to reset all your progress forever, click ${resetCountdown} times`);
    resetCountdown--;
  };

  return (
    <Style className='tab-outlet'>
      <div>
        <h3>Import</h3>
        <Container>
          <Row>
            <Col className='label'>Import Video</Col>
          </Row>
          <Row>
            <Col>
              <Form.Control className='file'
                            type='file'
                            onChange={onVideoChange}
                            onClick={onInputClick} />
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col className='label'>Restore from backup file</Col>
          </Row>
          <Row>
            <Col>
              <Form.Control className='file'
                            type='file'
                            onChange={restoreFromBackupFile}
                            onClick={onInputClick} />
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col>
              <button className='btn btn-primary' onClick={saveBackupFile}>
                Save backup file
              </button>
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col>
              <button className='btn btn-outline' onClick={handleResetClick}>
                Reset All
              </button>
            </Col>
          </Row>
          {/*<Row>*/}
          {/*  <Col className='label'>Import Subtitles</Col>*/}
          {/*  <Col>*/}
          {/*    <input className='file' type='file' onChange={onVideoChange} onClick={onInputClick} />*/}
          {/*  </Col>*/}
          {/*</Row>*/}
        </Container>
      </div>
    </Style>
  );
}
