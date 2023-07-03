import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { languagesApi, speechApi } from '../../../api/axios';
import { setLanguages } from '../../../store/languagesReducer';
import { toPercentsDelta } from '../../../utils';
import { addPreset, patchPreset, removePreset } from '../../../store/sessionReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Preset } from '../../../models';

const Style = styled.div`
  .presets-list {
    max-height: 200px;
    overflow-y: scroll;
  }

  .offset {
    height: 30px;
  }

  .text-to-voice {
    width: 100%;
    background-color: transparent;
    color: white;
    padding: 10px;
    min-height: 100px;
    max-height: 300px;
  }

  .audio {
    min-width: 100%;
    height: 40px !important;
    margin: 10px 0 5px 0;
  }
`;

export default function PresetsTab() {
  const presets = useSelector(store => store.session.presets);

  const $audioPlayer = createRef();
  const [lang, setLang] = useState({ locale: 'en-US', voices: null });
  const [voice, setVoice] = useState({});
  const [style, setStyle] = useState('');
  const [styleDegree, setStyleDegree] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [text, setText] = useState(`As an unperfect actor on the stage
Who with his fear is put besides his part,
Or some fierce thing replete with too much rage,
Whose strength's abundance weakens his own heart.`);
  const [extraAccuracy, setExtraAccuracy] = useState(false);
  const dispatch = useDispatch();
  let languages = useSelector(store => store.languages.languages) || [];
  let maxPresetId = useSelector(store => store.session.presets.length
    ? Math.max.apply(null, (store.session.presets).map(x => x.id)) : 0);

  useEffect(() => {
    async function fetchLanguages() {
      const newLanguages = await languagesApi.getAll('dev_placeholder');
      if (newLanguages.length < 1) {
        throw new Error('No languages fetched :(');
      }
      dispatch(setLanguages(newLanguages));
      const defaultLang = newLanguages.find(x => x.locale === lang.locale) || newLanguages[0];
      setLang(defaultLang);
      setVoice(defaultLang.voices ? defaultLang.voices[0] : {});
    }

    if (languages.length === 0) {
      fetchLanguages();
    } else {
      const defaultLang = languages.find(x => x.locale === lang.locale) || languages[0];
      setLang(defaultLang);
      setVoice(defaultLang.voices ? defaultLang.voices[0] : {});
    }
  }, [languages, lang.locale, dispatch]);

  const speak = useCallback(() => {
    async function speakAsync() {
      const request = {
        locale: lang.locale,
        voice: voice.key,
        text: text,
        style: style,
        styleDegree: styleDegree,
        // role: 'string',
        pitch: pitch,
        volume: 1,
        speed: 0,
      };
      console.log('req', request);
      const response = await speechApi.single(request, 'dev_placeholder');
      if ($audioPlayer.current) {
        $audioPlayer.current.src = response.url;
      }
      console.log('res', response);
    }

    speakAsync();
  }, [lang, voice, text, style, styleDegree, pitch, $audioPlayer]);

  const createPreset = useCallback(() => new Preset({
    id: ++maxPresetId,
    displayName: `${lang.displayName} ${voice.displayName} ${style ? style : ''} ${maxPresetId}`,
    locale: lang.locale,
    voice: voice.key,
    style,
    styleDegree,
    pitch,
    wordsPerMinute: voice.wordsPerMinute,
  }), [maxPresetId, lang, voice, style, styleDegree, pitch]);

  return (
    <Style className='tab-outlet'>
      <div>
        <h3>Presets</h3>
        <ListGroup className='presets-list app-list-group'>
          {presets.map((preset) => (
            <ListGroup.Item
              key={preset.id}>
              <input className='list-item-text'
                     type='text'
                     value={preset.displayName}
                     onChange={(event) =>
                       dispatch(patchPreset(preset.id, { displayName: event.target.value }))} />
              <span className='list-item-actions'>
            <button
              className='btn'
              onClick={() => dispatch(removePreset(preset.id))}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div>
        <h3>Build Azure Preset</h3>
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
          {/* ************ Extra Accuracy ************ */}
          <Row>
            <Col className='label'>Extra Accuracy Inputs</Col>
            <Col>
              <Form.Check
                checked={extraAccuracy}
                onChange={(event) => setExtraAccuracy(event.target.checked)} />
            </Col>
          </Row>
          <Row>
            <Col>
            <textarea
              className='text-to-voice'
              rows={6} value={text}
              onChange={(event) => setText(event.target.value)}>
            </textarea>
            </Col>
          </Row>
          <Row>
            <Col>
              <audio ref={$audioPlayer} className='audio' src='' controls>
                Preview is not supported
              </audio>
            </Col>
          </Row>
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
                onClick={() => dispatch(addPreset(createPreset()))}>
                Save Preset
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </Style>
  );
}
