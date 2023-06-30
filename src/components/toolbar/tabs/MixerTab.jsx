import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../store/settingsReducer';

const Style = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  .master {
    ::-ms-fill-lower {
      background: var(--c-primary);
    }
  }

  .volume-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    border: 1px solid rgb(255 255 255 / 20%);

    input {
      transform: rotate(270deg);
      height: 30px;
      width: 200px;
      position: absolute;
      top: 42%;
      left: -99px;
    }

    label {
      font-size: 12px;
      width: 100%;
      text-align: center;
      padding: 5px 2px;
      border-top: 1px solid rgb(255 255 255 / 20%);
    }
  }

  .input-wrapper {
    position: relative;
    display: inline-block;
    height: 220px;
  }
`;

function AudioVolumeItem({ title, propertyName, type, speaker }) {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);

  return (
    <div className={type ? 'volume-wrapper ' + type : 'volume-wrapper'}>
      <div className='input-wrapper'>
        <input type='range' orient='vertical'
               min={0} max={1} step={0.01}
               value={settings[propertyName]}
               onChange={(e) =>
                 dispatch(setSettings({ [propertyName]: e.target.value }))} />
      </div>
      <div>
        {Math.round(settings[propertyName] * 100)}%
      </div>
      <label>{title}</label>
    </div>
  );
}

export default function MixerTab(props) {
  return (
    <Style className='mixer'>
      <AudioVolumeItem title='Master' propertyName='masterVolume' type='master' />
      <AudioVolumeItem title='Original' propertyName='originalVolume' />
    </Style>
  );
}
