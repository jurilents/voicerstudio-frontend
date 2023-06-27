import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';
import { Row } from 'react-bootstrap';

const Style = styled.div`
`;

const codec = {
  'WAV': [
    { displayName: 'RIFF 8KHz 16Bit', value: 'Riff8Khz16BitMonoPcm' },
    { displayName: 'RIFF 16KHz 16Bit', value: 'Riff16Khz16BitMonoPcm' },
    { displayName: 'RIFF 24KHz 16Bit', value: 'Riff24Khz16BitMonoPcm' },
    { displayName: 'RIFF 44.1KHz 16Bit', value: 'Riff44100Hz16BitMonoPcm' },
    { displayName: 'RIFF 48KHz 16Bit', value: 'Riff48Khz16BitMonoPcm', default: true },
  ],
};

export default function ExportTab(props) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);

  function onFormatChange(event) {
    const value = event.target.value;
    dispatch(setSettings({ exportFormat: value }));
  }

  function onCodecChange(event) {
    const value = event.target.value;
    console.log('Selected codec: ', value);
    dispatch(setSettings({ exportCodec: value }));
  }

  return (
    <Style className='hotkey'>
      <Row>
        <select onChange={onFormatChange}>
          {Object.keys(codec).map((item, index) =>
            (<option key={index} value={item}>{item}</option>),
          )}
        </select>
        <select onChange={onCodecChange} defaultValue={settings.exportCodec}>
          {codec[settings.exportFormat].map((item, index) =>
            (<option key={index} value={item.value}>
              {item.displayName}
            </option>),
          )}
        </select>
      </Row>
    </Style>
  );
}
