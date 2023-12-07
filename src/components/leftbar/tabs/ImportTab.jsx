import React, {useCallback} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Container, Form, Row} from 'react-bootstrap';
import {downloadObjectAsJson, getExt} from '../../../utils';
import {restoreFromJson, setVideo} from '../../../store/sessionReducer';
import {useVideoStorage} from '../../../hooks';
import {toast} from 'react-toastify';
import {dropDatabase} from '../../../hooks/openDatabase';
import {useTranslation} from 'react-i18next';

const Style = styled.div``;

let resetCountdown = 5;

const backupExtension = 'voicerbak';

export default function ImportTab() {
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player.videoPlayer);
  const session = useSelector((store) => store.session);
  const {saveVideo} = useVideoStorage();
  const {t} = useTranslation();

  const onVideoChange = useCallback(
    (event) => {
      if (!player) {
        toast.warn('Player is not ready');
        return;
      }
      const file = event.target.files[0];
      if (file) {
        const ext = getExt(file.name);
        const canPlayType = player.canPlayType(file.type);
        if (canPlayType === 'maybe' || canPlayType === 'probably') {
          toast.info('Video is uploading...');
          saveVideo('video1', file).then(() => {
            const url = URL.createObjectURL(new Blob([file]));
            player.currentTime = 0;
            dispatch(setVideo(url));
            toast.success('Video uploaded! Refreshing the page...');
            setTimeout(() => window.location.reload(), 1000);
          });
        } else {
          toast.error(`${t('tabs.import.videoImportError')}: ${file.type || ext}`);
        }
      }
    },
    [dispatch, player, saveVideo],
  );

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
      if (ext !== backupExtension) {
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
    const filename = `backup_${date}`;

    downloadObjectAsJson(session, filename, backupExtension);
  };

  const handleResetClick = () => {
    if (resetCountdown === 0) {
      localStorage.clear();
      dropDatabase().then(() => {
        window.location.reload();
      });
      return;
    }

    toast.warn(t('tabs.import.resetWarning', {resetCountdown}));
    resetCountdown--;
  };

  return (
    <Style className="tab-outlet">
      <div>
        <h3>{t('tabs.import.title')}</h3>
        <Container>
          <Row>
            <Col className="label">{t('tabs.import.importVideo')}</Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                className="file"
                type="file"
                onChange={onVideoChange}
                onClick={onInputClick}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="label">
              {t('tabs.import.restoreFromBackupFile')}&nbsp;<b>*.{backupExtension}</b>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                className="file"
                type="file"
                accept={'.' + backupExtension}
                onChange={restoreFromBackupFile}
                onClick={onInputClick}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <button className="btn btn-primary" onClick={saveBackupFile}>
                {t('tabs.import.saveBackupFile')}
              </button>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <button className="btn btn-outline" onClick={handleResetClick}>
                {t('tabs.import.resetSubtitlesOnly')}
              </button>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <button className="btn btn-outline" onClick={handleResetClick}>
                {t('tabs.import.resetAll')}
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
