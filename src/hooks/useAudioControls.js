import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../store/settingsReducer';
import { patchSpeaker } from '../store/sessionReducer';

export function useAudioControls() {
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);

  const toggleOriginalSolo = () => {
    dispatch(setSettings({ originalSolo: !settings.originalSolo, originalMute: false }));
  };

  const toggleOriginalMute = () => {
    dispatch(setSettings({ originalMute: !settings.originalMute, originalSolo: false }));
  };

  const toggleSpeakerSolo = (speaker) => {
    dispatch(patchSpeaker(speaker.id, { solo: !speaker.solo, mute: false }));
  };

  const toggleSpeakerMute = (speaker) => {
    dispatch(patchSpeaker(speaker.id, { mute: !speaker.mute, solo: false }));
  };

  return { toggleOriginalMute, toggleOriginalSolo, toggleSpeakerSolo, toggleSpeakerMute };
}
