import React from 'react';
import styled from 'styled-components';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash/fp';
import { useVoicer } from '../../../hooks';

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
`;

export default function GeneralTab() {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const { speakAll } = useVoicer();

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
        <h3></h3>
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
          <Row className='mt-3'>
            <Col xs={6} className='label'>Show subtitle note</Col>
            <Col xs={6} className='custom-input-wrap'>
              <Form.Check checked={settings.showNote}
                          onChange={() => dispatch(setSettings({
                            showNote: !settings.showNote,
                          }))} />
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col>
              <button className='btn btn-outline'
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
