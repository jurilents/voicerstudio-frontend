import Modal from 'react-modal';
import { Col, Form, Row } from 'react-bootstrap';
import React, { createRef, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Status } from '../../api/constants';
import { toPercentsDelta } from '../../utils';
import { languagesApi, speechApi } from '../../api/axios';
import { toast } from 'react-toastify';
import { setAzureLanguages, setVMLanguages } from '../../store/languagesReducer';
import { Preset } from '../../models';
import { addPreset } from '../../store/sessionReducer';
import { VoicingService } from '../../models/enums';
import { useVoicer } from '../../hooks';

const Style = styled.div`
  .audio {
    min-width: 100%;
    max-width: 100%;
    width: 100%;
    height: 40px !important;
    margin: 5px 0 15px 0;
  }
`;

const AddPresetModal = ({ isOpen, setIsOpen }) => {
  let maxPresetId = useSelector(store => store.session.presets.length
    ? Math.max.apply(null, (store.session.presets).map(x => x.id)) : 0);

  const $audioPlayer = createRef();
  const [extraAccuracy, setExtraAccuracy] = useState(false);
  const [voicingService, setVoicingService] = useState(VoicingService.Azure);
  const [langsFetchStatus, setLangsFetchStatus] = useState(Status.none);
  const [status, setStatus] = useState(Status.none);
  const [sampleSrc, setSampleSrc] = useState('');

  const [lang, setLang] = useState({ locale: 'en-US', voices: [] });
  const [voice, setVoice] = useState({});
  const [style, setStyle] = useState('');
  const [styleDegree, setStyleDegree] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [text, setText] = useState(`This priceless pearl of the primordial knowledge removes the cloak from all mysteries of the material world`);

  const dispatch = useDispatch();
  const { speakSub } = useVoicer();
  let languages = useSelector(store => voicingService === VoicingService.Azure
    ? store.languages.azure
    : store.languages.voiceMaker) || [];
  const allSelectedCredentials = useSelector(store => store.session.selectedCredentials);
  const selectedCred = allSelectedCredentials[voicingService];

  useEffect(() => {
    async function fetchLanguages() {
      setLangsFetchStatus(Status.loading);
      const newLanguages = await languagesApi.getAll(voicingService, selectedCred.value);
      if (newLanguages.length < 1) {
        toast.error('No languages fetched :(');
        setLangsFetchStatus(Status.failure);
        return;
      }

      if (voicingService === VoicingService.Azure) {
        dispatch(setAzureLanguages(newLanguages));
      } else if (voicingService === VoicingService.VoiceMaker) {
        dispatch(setVMLanguages(newLanguages));
      } else {
        toast.error(`Invalid service selected: ${voicingService}`);
        setLangsFetchStatus(Status.failure);
        return;
      }
      const defaultLang = newLanguages.find(x => x.locale === lang.locale) || newLanguages[0];
      setLang(defaultLang);
      setVoice(defaultLang.voices ? defaultLang.voices[0] : {});
      setLangsFetchStatus(Status.success);
    }

    if (languages.length === 0) {
      fetchLanguages().catch(err => {
        toast.error(`Languages did not fetch`);
        setLangsFetchStatus(Status.failure);
      });
    } else {
      const defaultLang = languages.find(x => x.locale === lang.locale) || languages[0];
      setLang(defaultLang);
      setVoice(defaultLang.voices ? defaultLang.voices[0] : {});
      setLangsFetchStatus(Status.success);
    }
  }, [voicingService, languages, lang.locale, dispatch]);

  const speak = useCallback(() => {
    async function speakAsync() {
      const request = {
        service: voicingService,
        locale: lang.locale,
        voice: voice.key,
        text: text,
        style: style,
        styleDegree: styleDegree,
        // role: 'string',
        pitch: pitch,
        volume: 0,
        speed: 0,
        outputFormat: 'Wav',
        sampleRate: 'Rate48000',
      };

      try {
        console.log('req', request);
        console.log('selectedCred.value', selectedCred.value);
        const response = await speechApi.single(request, selectedCred.value);
        if (!response) return;
        setSampleSrc(response.url);
        console.log('res', response);
        toast.info('Speak succeeded');
      } catch (err) {
        console.log('error', err);
        const errText = await err.response?.data.text();
        const errJson = JSON.parse(errText);
        toast.error(`Speak failed: ${errJson?.message || 'Unknown error'}`);
      }
    }

    speakAsync().catch(err => {
      toast.error(`Speak failed ${err}`);
    });
  }, [voicingService, lang, voice, text, style, styleDegree, pitch, setSampleSrc]);

  useEffect(() => {
    if ($audioPlayer.current) {
      $audioPlayer.current.src = sampleSrc;
    }
  }, [sampleSrc, $audioPlayer.current]);


  const createPreset = useCallback(() => new Preset({
    id: ++maxPresetId,
    service: voicingService,
    displayName: `${voice.displayName} ${style ? style + ' ' : ''}${maxPresetId} (${lang.displayName.split(' ')[0]})`,
    locale: lang.locale,
    voice: voice.key,
    style,
    styleDegree,
    pitch,
    wordsPerMinute: voice.wordsPerMinute,
  }), [maxPresetId, voicingService, lang, voice, style, styleDegree, pitch]);

  const onSavePreset = useCallback(() => {
    const preset = createPreset();
    dispatch(addPreset(preset));
    toast.success(`New preset added: '${preset.displayName}'`);
  }, [dispatch, createPreset]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleStyleChange = (value) => {
    console.log('new style: ', value);
    setStyle(value);
  };

  const handleVoiceChange = (value) => {
    console.log('new voice: ', value);
    if (typeof value === 'string') {
      setVoice(lang.voices.find(x => x.key === value));
    } else {
      setVoice(value);
    }
    handleStyleChange('');
  };

  const handleLanguageChange = (value) => {
    console.log('new lang: ', value);
    const newLang = languages.find(x => x.locale === value);
    setLang(newLang);
    handleVoiceChange(newLang.voices?.length ? newLang.voices[0] : {});
  };

  return (
    <Modal isOpen={isOpen}
           ariaHideApp={false}
           style={{
             content: {
               inset: 'unset',
             },
           }}
           onRequestClose={closeModal}
           contentLabel='Add Credentials'>
      <button className='btn-app-close' onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <h2 className='my-4'>Add Voice Preset</h2>

      {langsFetchStatus !== Status.success && (
        <Style className='modal-container speaker-form container'>
          <Row>
            <Col xs={12}>Loading...</Col>
          </Row>
        </Style>
      )}

      {langsFetchStatus === Status.success && (
        <Style className='modal-container speaker-form container'>

          {/* ************ Voicing Service ************ */}
          <Row>
            <Col xs={4} className='label'>Voicing service</Col>
            <Col xs={8}>
              <Form.Select className='app-select'
                           onChange={(event) => setVoicingService(event.target.value)}
                           value={voicingService}>
                {Object.entries(VoicingService).map(([key, val], index) => (
                  <option key={index} value={val}>{key}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* ************ Credentials ************ */}
          <Row>
            <Col xs={4} className='label'>Credentials</Col>
            <Col xs={8}>
              {selectedCred.displayName}
            </Col>
          </Row>

          {/* ************ Language ************ */}
          <Row className='mt-4'>
            <Col xs={4} className='label'>Language</Col>
            <Col xs={8}>
              <Form.Select className='app-select'
                           onChange={(event) => handleLanguageChange(event.target.value)}
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
              <Col xs={4} className='label'>Voice</Col>
              <Col xs={8}>
                <Form.Select
                  className='app-select'
                  defaultValue=''
                  onChange={(event) => handleVoiceChange(event.target.value)}>
                  {lang.voices.map((voice) => (
                    <option key={voice.key} value={voice.key}>
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
              <Col xs={4} className='label'>Style</Col>
              <Col xs={8}>
                <Form.Select className='app-select'
                             value={style}
                             onChange={(event) => handleStyleChange(event.target.value)}>
                  <option value=''>--- neutral ---</option>
                  {voice.styles.map((style, index) => (
                    <option key={index} value={style}>
                      {style}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          ) : null}

          {/* ************ Style Degree ************ */}
          {!!style ? (
            <Row>
              <Col xs={4} className='label'>Style degree</Col>
              <Col xs={6}>
                <input type='range'
                       min={0.01} max={2.0}
                       step={extraAccuracy ? 0.001 : 0.01}
                       value={styleDegree}
                       onChange={(event) => setStyleDegree(+event.target.value)} />
              </Col>
              <Col xs={1}>
                <button
                  className='app-reset-btn'
                  onClick={() => setStyleDegree(1)}>
                  <FontAwesomeIcon icon={faRedoAlt} />
                </button>
              </Col>
              <Col xs={1}>
                <span>{toPercentsDelta(styleDegree, false, extraAccuracy)}</span>
              </Col>
            </Row>
          ) : null}

          {/* ************ Baseline Pitch ************ */}
          <Row>
            <Col xs={4} className='label'>Baseline pitch</Col>
            <Col xs={6}>
              <input type='range'
                     min={-0.5} max={0.5}
                     step={extraAccuracy ? 0.001 : 0.01}
                     value={pitch}
                     onChange={(event) => setPitch(+event.target.value)} />
            </Col>
            <Col xs={1}>
              <button
                className='app-reset-btn'
                onClick={() => setPitch(0)}>
                <FontAwesomeIcon icon={faRedoAlt} />
              </button>
            </Col>
            <Col xs={1}>
              <span>{toPercentsDelta(pitch, true, extraAccuracy)}</span>
            </Col>
          </Row>

          {/* ************ Extra Accuracy ************ */}
          <Row>
            <Col xs={11} className='label'>Extra accuracy inputs</Col>
            <Col xs={1} className='custom-input-wrap'>
              <Form.Check
                checked={extraAccuracy}
                onChange={(event) => setExtraAccuracy(event.target.checked)} />
            </Col>
          </Row>

          {/* ************ Text 2 Voice ************ */}
          <Row className='my-3'>
            <Col xs={12}>
            <textarea className='text-to-voice'
                      rows={4}
                      value={text}
                      onChange={(event) => setText(event.target.value)}>
            </textarea>
            </Col>
          </Row>

          {/* ************ Voice Audio ************ */}
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
                Generate Sample Speech
              </button>
            </Col>
          </Row>

          <Row>
            <Col>
              <button
                className='btn btn-primary'
                onClick={onSavePreset}>
                Add Preset
              </button>
            </Col>
          </Row>
        </Style>
      )}
    </Modal>
  );
};

export default memo(AddPresetModal,
  (prevProps, nextProps) => {
    return prevProps.isOpen === nextProps.isOpen && prevProps.setIsOpen === nextProps.setIsOpen;
  });
