import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import { getExt } from '../../../utils';
import { setVideo } from '../../../store/sessionReducer';
import { t } from 'react-i18nify';
import FFmpeg from '@ffmpeg/ffmpeg';
import { useVideoStorage } from '../../../hooks';
import { toast } from 'react-toastify';

const Style = styled.div`
`;

export default function ImportTab(props) {
  const dispatch = useDispatch();
  // const settings = useSelector(store => store.settings);
  // const subs = useSelector(store => store.session.subs);
  // const speakers = useSelector(store => store.session.speakers);
  // const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  const { saveVideo } = useVideoStorage();

  const decodeAudioData = useCallback(
    async (file) => {
      try {
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ log: true });
        ffmpeg.setProgress(({ ratio }) => props.setProcessing(ratio * 100));
        props.setLoading(t('LOADING_FFMPEG'));
        await ffmpeg.load();
        // const extension = file.name.substring(file.name.lastIndexOf('.'));
        const fileBytes = await fetchFile(file);
        ffmpeg.FS('writeFile', file.name, fileBytes);
        props.setLoading('');
        props.notify({
          message: t('DECODE_START'),
          level: 'info',
        });
        const output = `${Date.now()}.mp3`;
        await ffmpeg.run('-i', file.name, '-ac', '1', '-ar', '8000', output);
        const uint8 = ffmpeg.FS('readFile', output);
        // download(URL.createObjectURL(new Blob([uint8])), `${output}`);
        // await props.waveform.decoder.decodeAudioData(uint8);
        // props.waveform.drawer.update();
        props.setProcessing(100);
        // await saveVideo('video1', file);
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
    [props.notify, props.setProcessing, props.setLoading],
  );

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
        {/*<div className='btn secondary' onClick={() => downloadSub('json')}>*/}
        {/*  <Translate value='EXPORT_JSON' />*/}
        {/*</div>*/}
        {/*<div className='btn secondary' onClick={() => downloadSub('srt')}>*/}
        {/*  <Translate value='EXPORT_SRT' />*/}
        {/*</div>*/}
        {/*<div className='btn'>*/}
        {/*  <Translate value='OPEN_VIDEO' />*/}
        {/*</div>*/}

        <Container>
          <Row>
            <Col className='label'>Import Video</Col>
            <Col>
              <input className='file' type='file' onChange={onVideoChange} onClick={onInputClick} />
            </Col>
          </Row>
          <Row>
            <Col className='label'>Import Subtitles</Col>
            <Col>
              <input className='file' type='file' onChange={onVideoChange} onClick={onInputClick} />
            </Col>
          </Row>
        </Container>
      </div>
    </Style>
  );
}
