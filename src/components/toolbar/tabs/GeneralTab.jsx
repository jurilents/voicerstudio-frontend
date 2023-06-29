import React from 'react';
import styled from 'styled-components';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { toPercentsDelta } from '../../../utils';

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

  .reset-speed-btn {
    transform: rotateY(180deg) rotateZ(30deg);
  }
`;

export default function GeneralTab(props) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);

  return (
    <Style className='tab-outlet'>
      <div>
        <h3>Tools</h3>
        <Container>
          {/* ************ Single Record Mode ************ */}
          <Row>
            <Col className='label'>Single record mode</Col>
            <Col>
              <Form.Check
                checked={settings.singleRecordMode}
                onChange={(event) =>
                  dispatch(setSettings({ singleRecordMode: event.target.checked }))} />
            </Col>
          </Row>
          {/* ************ Playback speed ************ */}
          <Row>
            <Col className='label'>Playback speed</Col>
            <Col className='speed-wrapper'>
              <button
                className='speed-btn'
                onClick={() => dispatch(setSettings({ playbackSpeed: Math.max(settings.playbackSpeed - 0.25, 0.25) }))}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className='speed-text'>{Math.round(settings.playbackSpeed * 100)}%</span>
              <button
                className='speed-btn'
                onClick={() => dispatch(setSettings({ playbackSpeed: Math.min(settings.playbackSpeed + 0.25, 4) }))}>
                <FontAwesomeIcon icon={faAdd} />
              </button>
              <button
                className='speed-btn reset-speed-btn'
                onClick={() => dispatch(setSettings({ playbackSpeed: 1 }))}>
                <FontAwesomeIcon icon={faRedoAlt} />
              </button>
            </Col>
          </Row>
          {/* ************ Wave Zoom ************ */}
          <Row>
            <Col className='label'>Wave zoom</Col>
            <Col className='range-wrapper'>
              <input
                type='range' min={0.1} max={2} step={0.1} value={settings.waveZoom}
                onChange={(event) =>
                  dispatch(setSettings({ waveZoom: +event.target.value }))} />
              <span>{toPercentsDelta(settings.waveZoom)}</span>
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
