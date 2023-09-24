import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { download } from '../../../utils';
import { selectSpeaker } from '../../../store/sessionReducer';
import { sub2srt, sub2txt, sub2vtt } from '../../../libs/readSub';
import { toast } from 'react-toastify';
import { useVoicer } from '../../../hooks';

const Style = styled.div`
  .app-input {
    width: 100%;
  }

  .file-extension {
    padding: 0;
  }

  .pattern-key {
    font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }
`;

const codec = {
  'WAV': [
    { displayName: 'RIFF 8KHz 16Bit', value: 'Rate8000' },
    { displayName: 'RIFF 16KHz 16Bit', value: 'Rate16000' },
    { displayName: 'RIFF 24KHz 16Bit', value: 'Rate24000' },
    // { displayName: 'RIFF 44.1KHz 16Bit', value: 'Riff44100Hz16BitMonoPcm' },
    { displayName: 'RIFF 48KHz 16Bit', value: 'Rate48000' },
  ],
};

export default function ExportTab() {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState();
  const { exportCodec, exportFormat, exportFileName } = useSelector(store => store.settings);
  const { speakers, selectedSpeaker } = useSelector(store => store.session);
  const { buildExportFileName, generateAndExport } = useVoicer();

  const downloadSub = useCallback((type) => {
    try {
      let text = '';
      // const name = `${Date.now()}.${type}`;
      if (type === 'vtt') {
        text = sub2vtt(selectedSpeaker.subs);
      } else if (type === 'srt') {
        text = sub2srt(selectedSpeaker.subs);
      } else if (type === 'txt') {
        text = sub2txt(selectedSpeaker.subs);
      } else if (type === 'json') {
        const toJson = selectedSpeaker.subs.map((sub) => ({
          text: sub.text,
          start: sub.start,
          end: sub.end,
        }));
        text = JSON.stringify(toJson, null, 2);
      } else {
        console.error(`Export format does not supported: '${type}'`);
        return;
      }
      const url = URL.createObjectURL(new Blob([text]));
      const fileName = buildExportFileName(type);
      download(url, fileName);
      toast.success(<>Export file "<b>{fileName}</b>" succeed</>);
    } catch (e) {
      toast.error(`Export file failed: ${e}`);
    }
  }, [selectedSpeaker]);

  return (
    <Style className='tab-outlet'>
      <div>
        <h3>Export</h3>
        <Container>
          <Row>
            <Col className='label'>Speaker</Col>
            <Col>
              <Form.Select className='app-select'
                           onChange={(event) =>
                             dispatch(selectSpeaker(+event.target.value))}
                           value={selectedSpeaker.id}>
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
              <Form.Select className='app-select'
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
              <Form.Select className='app-select'
                           onChange={(event) =>
                             dispatch(setSettings({ exportCodec: event.target.value }))}
                           value={exportCodec}>
                {codec[exportFormat].map((item, index) =>
                  (<option key={index} value={item.value}>
                    {item.displayName}
                  </option>),
                )}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <input className='app-input' type='text'
                     onChange={(event) =>
                       dispatch(setSettings({ exportFileName: event.target.value }))}
                     value={exportFileName} />
            </Col>
          </Row>
          <Row>
            <Col>Speaker Name</Col>
            <Col><span className='pattern-key'>{'{S}'}</span></Col>
          </Row>
          <Row>
            <Col>Speaker Language</Col>
            <Col><span className='pattern-key'>{'{L}'}</span></Col>
          </Row>
          <Row>
            <Col>Export Format</Col>
            <Col><span className='pattern-key'>{'{F}'}</span></Col>
          </Row>
          <Row>
            <Col>Current Date</Col>
            <Col><span className='pattern-key'>{'{D}'}</span></Col>
          </Row>
          <Row>
            <Col>Current Time</Col>
            <Col><span className='pattern-key'>{'{T}'}</span></Col>
          </Row>
          <Row className='mt-4'>
            <Col>
              <button className='btn btn-primary'
                      onClick={() => generateAndExport(setIsPending)}>
                Export {exportFormat}
              </button>
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col>
              <button className='btn btn-outline' onClick={() => downloadSub('srt')}>
                SRT
              </button>
            </Col>
            <Col>
              <button className='btn btn-outline' onClick={() => downloadSub('vtt')}>
                VTT
              </button>
            </Col>
            <Col>
              <button className='btn btn-outline' onClick={() => downloadSub('txt')}>
                TXT
              </button>
            </Col>
            <Col>
              <button className='btn btn-outline' onClick={() => downloadSub('json')}>
                JSON
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </Style>
  );
}
