import { patchSub } from '../store/sessionReducer';
import { VoicedStatuses } from '../models/Sub';
import { speechApi } from '../api/axios';
import { addAudio, removeAudio } from '../store/audioReducer';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useSubsAudioStorage } from './useSubsAudioStorage';
import { useCallback } from 'react';
import { settings } from '../settings';

export const useVoicer = () => {
  const dispatch = useDispatch();
  const { selectedSpeaker, selectedCredentials } = useSelector(store => store.session);
  const { saveSubAudio } = useSubsAudioStorage();

  const speakSub = useCallback(async (sub, options) => {
    if (!options) options = {};
    if (!selectedSpeaker.preset) {
      toast.warn('Cannot voice subtitles of selected speaker. Select a voice preset before voicing');
      return false;
    }
    if (!sub.canBeVoiced) {
      if (!options.fromBatch) toast.info('Subtitle cannot be voiced, because it is already voiced');
      return true;
    }
    if (sub.data?.src) {
      dispatch(removeAudio(sub.data?.src));
    }

    const cred = selectedCredentials[selectedSpeaker.preset.service];
    if (!cred?.value) {
      toast.error('Credentials are not valid');
      return false;
    }

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
      start: options.speed === undefined ? sub.startStr : null,
      end: options.speed === undefined ? sub.endStr : null,
      outputFormat: 'wav',
      sampleRate: 'Rate48000',
      speed: options.speed === undefined ? null : options.speed,
    };
    console.log('Single speech request:', request);
    dispatch(patchSub(sub, {
      data: VoicedStatuses.processing,
    }));
    const audio = await speechApi.single(request, cred.value);
    if (!audio) return false;
    console.log('single audio url', audio);
    dispatch(addAudio(audio.url));

    sub.data = sub.buildVoicedStamp(audio.url, audio.baseDuration);
    // If rate is to high or to low, reset it to default
    if (Math.abs(sub.acceleration) > settings.rateLimit) {
      sub.endTime = sub.start + audio.duration;
    }
    await saveSubAudio(sub.id, audio.blob);

    dispatch(patchSub(sub, {
      end: sub.end,
      data: sub.data,
    }));
    if (!options.fromBatch) toast.info('🎧 Subtitle voiced  🎧');
    return true;
  }, [dispatch, selectedSpeaker, selectedCredentials, saveSubAudio]);

  const speakAll = useCallback((options) => {
    if (!options) options = {};
    if (!selectedSpeaker?.preset) {
      toast.warn('Cannot voice subtitles of selected speaker. Select a voice preset before voiceover');
      return;
    }

    const cred = selectedCredentials[selectedSpeaker.preset.service];
    if (!cred?.value) {
      toast.error('Credentials are not valid');
      return false;
    }

    let promises = [];
    options.fromBatch = true;
    for (const sub of selectedSpeaker.subs) {
      promises.push(speakSub(sub, options));
    }

    Promise.all(promises).then((results) => {
      const voicedCount = results.filter(success => success).length;

      if (voicedCount === selectedSpeaker.subs.length) {
        toast.success('All subtitles of the selected speaker are voiced');
      } else if (voicedCount === 0) {
        toast.warn(`No subtitles of the selected speaker was voiced`);
      } else {
        toast.warn(`Some subtitles of selected speaker was not voiced`);
      }
    });
  }, [speakSub, dispatch, selectedSpeaker, selectedCredentials]);

  return { speakSub, speakAll };
};
