import styled from 'styled-components';
import React, { useCallback, useEffect } from 'react';
import { parsePreset } from '../../utils/presetParser';

const Style = styled.div`
  padding-top: 10px;

  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 5px;

    li {
      width: auto;
    }
  }

  .btn {
    border: 2px solid #009688;
    background: transparent;
    padding-left: 20px;
    padding-right: 20px;
    opacity: 90%;

    &.active {
      background-color: rgba(0, 150, 136, 0.9);
    }

    &:hover {
      background-color: #009688;
      opacity: 100%;
    }
  }

  .speaker-config {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    .preset-area {
      width: 85%;
      min-width: 85%;
      max-width: 85%;
      height: 66px;
      min-height: 66px;
      max-height: 66px;
    }

    .preset-apply {
      width: 15%;
      height: 66px;
    }

    textarea {
      flex: 1;
      width: 100%;
      //height: 100%;
      color: #fff;
      font-size: 12px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease;
      resize: none;
      outline: none;
    }
  }
`;

export default function DELETEMESpeakers({ notify, speakers, patchSpeaker, settings, setSettings, preset, setPreset }) {
  useEffect(() => {
    const speaker = speakers.find(x => x.id === settings.currentSpeaker);
    if (speaker.preset) {
      // setPreset(speaker.preset);
    } else {
      setSettings({ speaker });
    }
  }, [setSettings, speakers, settings.currentSpeaker]);

  const applyPreset = useCallback((preset) => {
    console.log(preset);
    const speaker = speakers.find(x => x.id === settings.currentSpeaker);
    try {
      if (!preset || speaker.preset === preset) {
        return;
      }
      const presetParts = preset.split(': ');
      let presetPayload;
      if (presetParts.length > 1) {
        speaker.name = presetParts[0];
        presetPayload = presetParts[1];
      } else {
        presetPayload = presetParts[0];
      }
      speaker.preset = preset;
      speaker.speechConfig = parsePreset(presetPayload);
      patchSpeaker(speaker.id, {
        preset: speaker.preset,
        speechConfig: speaker.speechConfig,
      });
      notify({
        message: `Preset for speaker "${speaker.name}" updates successfully!`,
        level: 'info',
      });
    } catch (e) {
      // console.error(e);
      notify({
        message: 'Invalid preset :(',
        level: 'error',
      });
    }
  }, [notify, speakers, patchSpeaker, settings.currentSpeaker]);

  return (
    <Style>
      <div className='speaker-config'>
        <textarea className='preset-area' rows={2} value={preset}
                  onChange={(e) => setPreset(e.target.value)}>
        </textarea>
        <button className='btn preset-apply'
                onClick={() => applyPreset(preset)}>
          Apply Preset
        </button>
      </div>
      <ul>
        {speakers.map((item) => (
          <li key={item.id}>
            <button className={item.id === settings.currentSpeaker ? 'btn active' : 'btn'}
                    onClick={(() => setSettings({ currentSpeaker: item.id }))}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </Style>
  );
}
