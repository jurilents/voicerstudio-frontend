import React from 'react';
import styled from 'styled-components';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { patchSub } from '../../../store/sessionReducer';
import { VoicedStatuses } from '../../../models/Sub';
import { speechApi } from '../../../api/axios';
import { addAudio, removeAudio } from '../../../store/audioReducer';
import { toast } from 'react-toastify';
import { useSubsAudioStorage } from '../../../hooks';
import _ from 'lodash/fp';

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

export default function GeneralTab(props) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const { selectedSpeaker, selectedCredentials } = useSelector(store => store.session);
  const { saveSubAudio } = useSubsAudioStorage();

  function speakAll() {
    async function fetch(sub) {
      const request = {
        service: selectedSpeaker.preset.service,
        locale: selectedSpeaker.preset.locale,
        voice: selectedSpeaker.preset.voice,
        text: sub.text,
        style: selectedSpeaker.preset.style,
        styleDegree: selectedSpeaker.preset.styleDegree,
        // role: 'string',
        pitch: selectedSpeaker.preset.pitch,
        volume: 1,
        start: sub.startStr,
        end: sub.endStr,
        outputFormat: 'wav',
        sampleRate: 'Rate48000',
        // speed: +speaker.speechConfig[7], // do not apply speed (rate)
      };
      console.log('Single speech request:', request);
      dispatch(patchSub(sub, {
        data: VoicedStatuses.processing,
      }));
      const cred = selectedCredentials[selectedSpeaker.preset.service];
      const audio = await speechApi.single(request, cred.value);
      console.log('single audio url', audio);
      dispatch(addAudio(audio.url));
      sub.endTime = sub.start + audio.duration;
      await saveSubAudio(sub.id, audio.blob);
      dispatch(patchSub(sub, {
        end: sub.end,
        data: sub.buildVoicedStamp(audio.url, audio.baseDuration),
      }));
      toast.info('Subtitle voiced');
    }

    if (!selectedSpeaker?.preset) {
      toast.warn('Cannot voice subtitles of selected speaker. There is no voice preset selected for it');
      return;
    }
    for (const sub of selectedSpeaker.subs) {
      if (!sub.canBeVoiced) continue;
      if (sub.data?.src) {
        dispatch(removeAudio(sub.data?.src));
      }

      fetch(sub).catch(err => {
        toast.error(`Voicing failed: ${err}`);
      });
    }

    toast.success('All subtitles of selected speaker voiced');
  }

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
        <h3>Tools</h3>
        <Container>
          {/* ************ Playback speed ************ */}
          <Row>
            <Col className='label'>Playback speed</Col>
            <Col className='speed-wrapper'>
              <button
                className='speed-btn'
                onClick={() => setPlaybackSpeed(settings.playbackSpeed - 0.25)}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className='speed-text'>{Math.round(settings.playbackSpeed * 100)}%</span>
              <button
                className='speed-btn'
                onClick={() => setPlaybackSpeed(settings.playbackSpeed + 0.25)}>
                <FontAwesomeIcon icon={faAdd} />
              </button>
              <button
                className='speed-btn app-reset-btn'
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
          <Row className='mt-4'>
            <Col>
              <button className='btn btn-outline' onClick={speakAll}>
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
