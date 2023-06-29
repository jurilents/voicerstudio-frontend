import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { speechApi } from '../../../api/axios';
import { download } from '../../../utils';
import { selectSpeaker } from '../../../store/sessionReducer';

const Style = styled.div`
`;

const codec = {
  'WAV': [
    { displayName: 'RIFF 8KHz 16Bit', value: 'Riff8Khz16BitMonoPcm' },
    { displayName: 'RIFF 16KHz 16Bit', value: 'Riff16Khz16BitMonoPcm' },
    { displayName: 'RIFF 24KHz 16Bit', value: 'Riff24Khz16BitMonoPcm' },
    { displayName: 'RIFF 44.1KHz 16Bit', value: 'Riff44100Hz16BitMonoPcm' },
    { displayName: 'RIFF 48KHz 16Bit', value: 'Riff48Khz16BitMonoPcm', default: true },
  ],
};

export default function ExportTab(props) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const subs = useSelector(store => store.session.subs);
  const speakers = useSelector(store => store.session.speakers);
  const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);

  const generateAndExport = useCallback(() => {
    async function fetch() {
      const speakerSubs = subs.filter(x => x.speaker === selectedSpeaker.id);
      const request = speakerSubs.map(sub => ({
        locale: selectedSpeaker.preset.locale,
        voice: selectedSpeaker.preset.voice,
        text: sub.text,
        style: selectedSpeaker.preset.style,
        styleDegree: selectedSpeaker.preset.styleDegree,
        // role: 'string',
        pitch: selectedSpeaker.preset.pitch,
        volume: 1,
        start: sub.start,
        end: sub.end,
      }));
      console.log('Batch speech request:', request);
      const audio = await speechApi.batch(request, 'dev_placeholder');
      console.log('result audio url', audio);
      download(audio.url, `[${selectedSpeaker.displayName}] output.wav`);
    }

    fetch();
  }, [speakers, selectedSpeaker, subs]);


  return (
    <Style className='tab-outlet'>
      <div>
        <h3>Export</h3>
        <Container>
          <Row>
            <Col className='label'>Speaker</Col>
            <Col>
              <Form.Select
                className='app-select'
                onChange={(event) =>
                  dispatch(selectSpeaker(+event.target.value))}
                defaultValue={settings.exportCodec}>
                {speakers.map((speaker, index) =>
                  (<option key={index} value={speaker.id}>
                    {speaker.displayName}
                  </option>),
                )}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col className='label'>Format</Col>
            <Col>
              <Form.Select
                className='app-select'
                onChange={(event) =>
                  dispatch(setSettings({ exportFormat: event.target.value }))}>
                {Object.keys(codec).map((item, index) =>
                  (<option key={index} value={item}>{item}</option>),
                )}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col className='label'>CODEC</Col>
            <Col>
              <Form.Select
                className='app-select'
                onChange={(event) =>
                  dispatch(setSettings({ exportCodec: event.target.value }))}
                defaultValue={settings.exportCodec}>
                {codec[settings.exportFormat].map((item, index) =>
                  (<option key={index} value={item.value}>
                    {item.displayName}
                  </option>),
                )}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <button className='btn btn-outline' onClick={generateAndExport}>
                Export
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </Style>
  );
}
