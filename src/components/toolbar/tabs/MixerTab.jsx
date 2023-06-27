import React from 'react';
import { getWaveformZoomSteps } from '../../../utils';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

const Style = styled.div`
  .vertical-range {
    transform: rotateZ(-90deg);
  }
`;

export default function MixerTab(props) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);

  return (
    <Style className='hotkey'>
      <label>
        Original
        <input className='vertical-range' type='range' min={1} max={getWaveformZoomSteps(props.waveform)}
               value={props.settings.zoom}
               onChange={(e) => props.setSettings({ zoom: e.target.value })} />
      </label>
      <input type='range' min={1} max={getWaveformZoomSteps(props.waveform)}
             value={props.settings.playbackSpeed}
             onChange={(e) => props.setSettings({ playbackSpeed: e.target.value })} />
      <input type='range' min={1} max={getWaveformZoomSteps(props.waveform)} value={props.settings.audioVolume}
             onChange={(e) => props.setSettings({ audioVolume: e.target.value })} />
      {/*<MultiRangeSlider min={1} max={100}*/}
      {/*                  onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)} />*/}
    </Style>
  );
}
