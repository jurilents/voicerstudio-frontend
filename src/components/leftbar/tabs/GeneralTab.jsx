import React from 'react';
import styled from 'styled-components';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash/fp';
import { useTranslator, useVoicer } from '../../../hooks';

const Style = styled.div`
  .speed-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .speed-btn {
      display: block;
      border: none;
      outline: none;
      background-color: rgb(255 255 255 / 10%);
      border-radius: 50%;
      padding: 5px 0 4px 0;
      min-width: 25px;
      width: 15px;
      color: white;
      font-size: 13px;

      &:hover {
        background-color: var(--c-primary-dark);
      }
    }
  }

  .powered-by-translator-mark {
    display: inline-block;
    margin-left: 1rem;
    color: #7a7a7a;

    a {
      color: var(--c-primary-light);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const translateTargetLanguages = [
  { value: 'en', displayName: 'English' },
  { value: 'ru', displayName: 'Russian / Русский' },
  { value: 'uk', displayName: 'Ukrainian / Українська' },
];

export default function GeneralTab() {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const { speakAll } = useVoicer();
  const { translateAll } = useTranslator();

  const setPlaybackSpeed = (value) => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    value = _.clamp(0.25, 4, value);
    dispatch(setSettings({ playbackSpeed: value }));
    engine.setPlayRate(value);
  };

  return (
    <Style className='tab-outlet'>
      <div>
        <h3>Tools & Tranlsation</h3>
        <Container>
          {/* ************ Playback speed ************ */}
          <Row>
            <Col className='label'>Playback speed</Col>
            <Col className='speed-wrapper'>
              <button className='speed-btn'
                      onClick={() => setPlaybackSpeed(settings.playbackSpeed - 0.25)}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className='speed-text'>{Math.round(settings.playbackSpeed * 100)}%</span>
              <button className='speed-btn'
                      onClick={() => setPlaybackSpeed(settings.playbackSpeed + 0.25)}>
                <FontAwesomeIcon icon={faAdd} />
              </button>
              <button className='speed-btn app-reset-btn'
                      onClick={() => setPlaybackSpeed(1)}>
                <FontAwesomeIcon icon={faRedoAlt} />
              </button>
            </Col>
          </Row>
          {/* ************ Wave Zoom ************ */}
          {/*<Row>*/}
          {/*  <Col className='label'>Wave zoom</Col>*/}
          {/*  <Col className='range-wrapper'>*/}
          {/*    <input*/}
          {/*      type='range' min={0.1} max={2} step={0.1} value={settings.waveZoom}*/}
          {/*      onChange={(event) =>*/}
          {/*        dispatch(setSettings({ waveZoom: +event.target.value }))} />*/}
          {/*    <span>{toPercentsDelta(settings.waveZoom)}</span>*/}
          {/*  </Col>*/}
          {/*</Row>*/}
          <Row className='mt-3 mb-0'>
            <Col xs={6} className='label'>Show subtitle note</Col>
            <Col xs={6} className='custom-input-wrap'>
              <Form.Check checked={settings.showNote}
                          onChange={() => dispatch(setSettings({
                            showNote: !settings.showNote,
                          }))} />
            </Col>
          </Row>
          {!!settings.showNote && (
            <>
              <Row>
                <Col xs={6} className='label'>Auto-translate to note</Col>
                <Col xs={6} className='custom-input-wrap'>
                  <Form.Check checked={settings.autoTranslateSub}
                              onChange={() => dispatch(setSettings({
                                autoTranslateSub: !settings.autoTranslateSub,
                              }))} />
                  <em className='powered-by-translator-mark'>
                    powered by <a href='https://deepl.com' target='_blank'>deepl.com</a>
                  </em>
                </Col>
              </Row>
              <Row>
                <Col className='label'>Translate source language</Col>
                <Col>
                  <Form.Select className='app-select'
                               value={settings.selectedTranslateSourceLang}
                               onChange={(event) =>
                                 dispatch(setSettings({ selectedTranslateSourceLang: event.target.value }))}>
                    {settings.translateSourceLangs.map((item) => (
                      <option key={item.locale} value={item.locale}>
                        {item.displayName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col className='label'>Translate target language</Col>
                <Col>
                  <Form.Select className='app-select'
                               value={settings.selectedTranslateTargetLang}
                               onChange={(event) =>
                                 dispatch(setSettings({ selectedTranslateTargetLang: event.target.value }))}>
                    {settings.translateTargetLangs.map((item) => (
                      <option key={item.locale} value={item.locale}>
                        {item.displayName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col>
                  <button className='btn btn-outline'
                          onClick={() => translateAll()}>
                    Refresh Translations
                  </button>
                </Col>
              </Row>
            </>
          )}
          <Row className='mt-4'>
            <Col>
              <button className='btn btn-primary'
                      onClick={() => speakAll({ speed: 0 })}>
                Speak All
              </button>
            </Col>
          </Row>
        </Container>
      </div>
      {/*<input type='range' min={1} max={getWaveformZoomSteps(props.waveform)} value={props.settings.zoom}*/}
      {/*       onChange={(e) => props.setSettings({ zoom: e.target.value })} />*/}
      {/*<input type='range' min={1} max={getWaveformZoomSteps(props.waveform)}*/}
      {/*       value={props.settings.playbackSpeed}*/}
      {/*       onChange={(e) => props.setSettings({ playbackSpeed: e.target.value })} />*/}
      {/*<input type='range' min={1} max={getWaveformZoomSteps(props.waveform)} value={props.settings.audioVolume}*/}
      {/*       onChange={(e) => props.setSettings({ audioVolume: e.target.value })} />*/}
      {/*<MultiRangeSlider min={1} max={100}*/}
      {/*                  onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)} />*/}
    </Style>
  );
}
