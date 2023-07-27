import { Col, Container, Form, Row } from 'react-bootstrap';
import { toPercentsDelta } from '../../../utils';
import React, { createRef, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { languagesApi, speechApi } from '../../../api/axios';
import { toast } from 'react-toastify';
import { setAzureLanguages, setVMLanguages } from '../../../store/languagesReducer';
import { Preset } from '../../../models';
import { addPreset } from '../../../store/sessionReducer';


export const VoicingService = {
  Azure: 'Azure',
  // VoiceMaker: 'VoiceMaker',
};

const PresetEditor = ({ maxPresetId, extraAccuracy, selectedService }) => {
  const $audioPlayer = createRef();
  const [sampleSrc, setSampleSrc] = useState('');

  const [lang, setLang] = useState({ locale: 'en-US', voices: null });
  const [voice, setVoice] = useState({});
  const [style, setStyle] = useState('');
  const [styleDegree, setStyleDegree] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [text, setText] = useState(`This priceless pearl of the primordial knowledge removes the cloak from all mysteries of the material world`);

  const dispatch = useDispatch();
  let languages = useSelector(store => selectedService === VoicingService.Azure
    ? store.languages.azure
    : store.languages.voiceMaker) || [];

  useEffect(() => {
    async function fetchLanguages() {
      const newLanguages = await languagesApi.getAll(selectedService, 'dev_placeholder');
      if (newLanguages.length < 1) {
        toast.error('No languages fetched :(');
        return;
      }

      if (selectedService === VoicingService.Azure) {
        dispatch(setAzureLanguages(newLanguages));
      } else if (selectedService === VoicingService.VoiceMaker) {
        dispatch(setVMLanguages(newLanguages));
      } else {
        toast.error(`Invalid service selected: ${selectedService}`);
        return;
      }
      const defaultLang = newLanguages.find(x => x.locale === lang.locale) || newLanguages[0];
      setLang(defaultLang);
      setVoice(defaultLang.voices ? defaultLang.voices[0] : {});
    }

    if (languages.length === 0) {
      fetchLanguages().catch(err => {
        toast.error(`Languages did not fetch`);
      });
    } else {
      const defaultLang = languages.find(x => x.locale === lang.locale) || languages[0];
      setLang(defaultLang);
      setVoice(defaultLang.voices ? defaultLang.voices[0] : {});
    }
  }, [selectedService, languages, lang.locale, dispatch]);

  const speak = useCallback(() => {
    async function speakAsync() {
      const request = {
        service: selectedService,
        locale: lang.locale,
        voice: voice.key,
        text: text,
        style: style,
        styleDegree: styleDegree,
        // role: 'string',
        pitch: pitch,
        volume: 1,
        speed: 0,
        outputFormat: 'Wav',
        sampleRate: 'Rate48000',
      };
      console.log('req', request);
      const response = await speechApi.single(request, 'dev_placeholder');
      setSampleSrc(response.url);
      console.log('res', response);
      toast.info('Speak succeeded');
    }

    speakAsync().catch(err => {
      toast.error(`Speak failed ${err}`);
    });
  }, [selectedService, lang, voice, text, style, styleDegree, pitch, setSampleSrc]);

  useEffect(() => {
    if ($audioPlayer.current) {
      $audioPlayer.current.src = sampleSrc;
    }
  }, [sampleSrc, $audioPlayer.current]);


  const createPreset = useCallback(() => new Preset({
    id: ++maxPresetId,
    service: selectedService,
    displayName: `${lang.displayName.split(' ')[0]} / ${voice.displayName} ${style ? style + ' ' : ''}${maxPresetId}`,
    locale: lang.locale,
    voice: voice.key,
    style,
    styleDegree,
    pitch,
    wordsPerMinute: voice.wordsPerMinute,
  }), [maxPresetId, selectedService, lang, voice, style, styleDegree, pitch]);

  const onSavePreset = useCallback(() => {
    const preset = createPreset();
    dispatch(addPreset(preset));
    toast.success(`New preset added: '${preset.displayName}'`);
  }, [dispatch, createPreset]);

  return (
    <div>
      <h3>{selectedService} Preset</h3>
      <Container className='speaker-form'>
        {/* ************ Language ************ */}
        <Row>
          <Col className='label'>Language</Col>
          <Col>
            <Form.Select
              className='app-select'
              onChange={(event) => {
                const newLang = languages.find(x => x.locale === event.target.value);
                setLang(newLang);
                setVoice(newLang.voices?.length ? newLang.voices[0] : null);
              }}
              defaultValue={lang.locale}>
              {languages.map((lang, index) => (
                <option key={index} value={lang.locale}>
                  {lang.displayName}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {/* ************ Voice ************ */}
        {lang.voices ? (
          <Row>
            <Col className='label'>Voice</Col>
            <Col>
              <Form.Select
                className='app-select'
                defaultValue=''
                onChange={(event) =>
                  setVoice(lang.voices.find(x => x.key === event.target.value))
                }>
                {lang.voices.map((voice) => (
                  <option key={voice.key}
                          value={voice.key}>
                    {voice.displayName} ({voice.gender}) {voice.styles.length > 0 ? ` ${voice.styles.length} styles` : null}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        ) : null}
        {/* ************ Voice Style ************ */}
        {voice?.styles?.length ? (
          <Row>
            <Col className='label'>Style</Col>
            <Col>
              <Form.Select
                className='app-select'
                defaultValue={style}
                onChange={(event) =>
                  setStyle(event.target.value)
                }>
                <option value=''>--- neutral ---</option>
                {voice.styles.map((style, index) => (
                  <option key={index}
                          value={style}>
                    {style}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        ) : null}
        {/* ************ Style Degree ************ */}
        {style ? (
          <Row>
            <Col className='label'>Style Degree</Col>
            <Col className='range-wrapper'>
              <input
                type='range' min={0.01} max={2} step={extraAccuracy ? 0.001 : 0.01} value={styleDegree}
                onChange={(event) => setStyleDegree(+event.target.value)} />
              <span>{toPercentsDelta(styleDegree, false, extraAccuracy)}</span>
            </Col>
          </Row>
        ) : null}
        {/* ************ Baseline Pitch ************ */}
        <Row>
          <Col className='label'>Baseline Pitch</Col>
          <Col className='range-wrapper'>
            <input
              type='range' min={-0.5} max={0.5} step={extraAccuracy ? 0.001 : 0.01} value={pitch}
              onChange={(event) => setPitch(+event.target.value)} />
            <span>{toPercentsDelta(pitch, true, extraAccuracy)}</span>
          </Col>
        </Row>
        {/* ************ Text 2 Voice ************ */}
        <Row>
          <Col>
            <textarea
              className='text-to-voice'
              rows={4} value={text}
              onChange={(event) => setText(event.target.value)}>
            </textarea>
          </Col>
        </Row>
        {sampleSrc && (
          <Row>
            <Col>
              <audio ref={$audioPlayer} className='audio' src='' controls>
                Preview is not supported
              </audio>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <button className='btn btn-outline' onClick={speak}>
              Speak
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <button
              className='btn btn-primary'
              onClick={onSavePreset}>
              Save Preset
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default memo(
  PresetEditor,
  (prevProps, nextProps) =>
    prevProps.selectedService === nextProps.selectedService &&
    prevProps.maxPresetId === nextProps.maxPresetId &&
    prevProps.extraAccuracy === nextProps.extraAccuracy,
);
