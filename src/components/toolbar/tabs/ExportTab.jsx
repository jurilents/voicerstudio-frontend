import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { speechApi } from '../../../api/axios';
import { download, getExt } from '../../../utils';
import { selectSpeaker } from '../../../store/sessionReducer';
import { file2sub, sub2srt, sub2txt, sub2vtt } from '../../../libs/readSub';
import { t } from 'react-i18nify';
import sub2ass from '../../../libs/readSub/sub2ass';
import { toast } from 'react-toastify';
import { VoicingService } from './PresetsTab.Editor';

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
    { displayName: 'RIFF 48KHz 16Bit', value: 'Rate48000', default: true },
  ],
};

export default function ExportTab(props) {
  const dispatch = useDispatch();
  const { exportCodec, exportFormat, exportFileName } = useSelector(store => store.settings);
  const { speakers, selectedSpeaker } = useSelector(store => store.session);

  const ensureExtension = useCallback((fileName, ext) => {
    const extension = '.' + ext.toLowerCase();
    if (typeof fileName === 'string') {
      if (!fileName.trimEnd().endsWith(extension)) {
        return fileName + extension;
      }
      return fileName;
    }
    return extension;
  }, []);

  const buildExportFileName = useCallback((ext) => {
    if (typeof exportFileName === 'string') {
      const fileName = ensureExtension(exportFileName, ext);
      const date = new Date(Date.now()).toISOString().split('T');
      return fileName
        .replace(/\{[S|s]}/g, selectedSpeaker.displayName)
        .replace(/\{[L|l]}/g, selectedSpeaker.preset?.locale || '???')
        .replace(/\{[F|f]}/g, exportCodec)
        .replace(/\{[D|d]}/g, date[0])
        .replace(/\{[T|t]}/g, date[1].substring(0, 5).replaceAll(':', '-'));
    }
  }, [selectedSpeaker, exportCodec, exportFileName]);

  const onSubtitleChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const ext = getExt(file.name);
        if (['ass', 'vtt', 'srt', 'json'].includes(ext)) {
          file2sub(file)
            .then((res) => {
              // props.clearSubs();
              // props.setSubtitle(res);
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
    [props.notify],
  );

  const downloadSub = useCallback((type) => {
    try {
      let text = '';
      // const name = `${Date.now()}.${type}`;
      switch (type) {
        case 'vtt':
          text = sub2vtt(selectedSpeaker.subs);
          break;
        case 'srt':
          text = sub2srt(selectedSpeaker.subs);
          break;
        case 'ass':
          text = sub2ass(selectedSpeaker.subs);
          break;
        case 'txt':
          text = sub2txt(selectedSpeaker.subs);
          break;
        case 'json':
          text = JSON.stringify(selectedSpeaker.subs);
          break;
        default:
          break;
      }
      const url = URL.createObjectURL(new Blob([text]));
      const fileName = buildExportFileName(type);
      download(url, fileName);
      toast.success(`Export file '${fileName}' succeed`);
    } catch (e) {
      toast.error(`Export file failed: ${e}`);
    }
  }, [selectedSpeaker]);

  const generateAndExport = useCallback(() => {
    async function fetch() {
      console.log(selectedSpeaker.preset);
      const request = selectedSpeaker.subs.map(sub => ({
        service: selectedSpeaker.preset.service,
        locale: selectedSpeaker.preset.locale,
        voice: selectedSpeaker.preset.voice,
        text: sub.text,
        style: selectedSpeaker.preset.style,
        styleDegree: selectedSpeaker.preset.styleDegree,
        // role: 'string',
        pitch: selectedSpeaker.preset.pitch,
        volume: selectedSpeaker.preset.service === VoicingService.VoiceMaker ? 0 : 1,
        start: sub.startStr,
        end: sub.endStr,
        outputFormat: exportFormat,
        sampleRate: exportCodec,
      }));
      console.log('Batch speech request:', request);
      const audio = await speechApi.batch(request, 'dev_placeholder');
      console.log('result audio url', audio);
      const fileName = buildExportFileName(exportFormat);
      download(audio.url, fileName);
      toast.success(`Export file '${fileName}' succeed`);
    }

    fetch().catch((e) => {
      console.log('export error', e);
      toast.error(`Export file failed: ${e}`);
    });
  }, [exportCodec, speakers, selectedSpeaker, exportFormat, exportCodec]);


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
                defaultValue={exportCodec}>
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
                defaultValue={exportCodec}>
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
              <button className='btn btn-primary' onClick={generateAndExport}>
                Export
              </button>
            </Col>
          </Row>
          <Row>
            <Col>
              <button className='btn btn-outline' onClick={() => downloadSub('srt')}>
                Export SRT
              </button>
            </Col>
          </Row>
          <Row>
            <Col>
              <button className='btn btn-outline' onClick={() => downloadSub('json')}>
                Export JSON
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </Style>
  );
}
