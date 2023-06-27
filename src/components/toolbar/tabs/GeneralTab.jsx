import React from 'react';
import MultiRangeSlider from '../MultiRangeSlider';
import { getWaveformZoomSteps } from '../../../utils';

export default function GeneralTab(props) {

  return (
    <div className='hotkey'>
      <input type='range' min={1} max={getWaveformZoomSteps(props.waveform)} value={props.settings.zoom}
             onChange={(e) => props.setSettings({ zoom: e.target.value })} />
      <input type='range' min={1} max={getWaveformZoomSteps(props.waveform)}
             value={props.settings.playbackSpeed}
             onChange={(e) => props.setSettings({ playbackSpeed: e.target.value })} />
      <input type='range' min={1} max={getWaveformZoomSteps(props.waveform)} value={props.settings.audioVolume}
             onChange={(e) => props.setSettings({ audioVolume: e.target.value })} />
      {/*<MultiRangeSlider min={1} max={100}*/}
      {/*                  onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)} />*/}
    </div>);
}
