import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { getExt } from '../../../utils';
import { setVideo } from '../../../store/sessionReducer';
import { t } from 'react-i18nify';
import { useVideoStorage } from '../../../hooks';
import { toast } from 'react-toastify';

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

export default function ImportTab(props) {
  const dispatch = useDispatch();
  // const settings = useSelector(store => store.settings);
  // const subs = useSelector(store => store.session.subs);
  // const speakers = useSelector(store => store.session.speakers);
  // const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  const { saveVideo } = useVideoStorage();

  const onVideoChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const ext = getExt(file.name);
        const canPlayType = props.player.canPlayType(file.type);
        if (canPlayType === 'maybe' || canPlayType === 'probably') {
          // decodeAudioData(file);
          saveVideo('video1', file);
          const url = URL.createObjectURL(new Blob([file]));
          // props.waveform.decoder.destroy();
          // props.waveform.drawer.update();
          // props.waveform.seek(0);
          props.player.currentTime = 0;
          // props.clearSubs();
          // props.setSubtitle([
          //   props.newSub({
          //     startStr: '00:00:00.000',
          //     endStr: '00:00:01.000',
          //     text: t('SUB_TEXT'),
          //   }),
          // ]);
          // props.player.src = url;
          dispatch(setVideo(url));
          toast.success('Video uploaded!');
        } else {
          toast.error(`${t('VIDEO_EXT_ERR')}: ${file.type || ext}`);
        }
      }
    },
    [dispatch, props.notify, props.player],
  );

  const onInputClick = useCallback((event) => {
    event.target.value = '';
  }, []);

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
