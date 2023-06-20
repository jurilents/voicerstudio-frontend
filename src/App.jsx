import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NotificationSystem from 'react-notification-system';
import DT from 'duration-time-conversion';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import Tool from './components/Tool';
import Subtitles from './components/sidebar/Subtitles';
import Player from './components/player/Player';
import Footer from './components/footer/Footer';
import Loading from './components/Loading';
import ProgressBar from './components/footer/ProgressBar';
import { getKeyCode } from './utils';
import { Settings, Speaker, Sub } from './models';
import Header from './components/header/Header';
import { isEmpty } from 'lodash';
import Speakers from './components/sidebar/Speakers';
import { languagesApi } from './api/axios';

const Style = styled.div`
  height: 100%;
  width: 100%;

  .main {
    display: flex;
    height: calc(100% - 200px);
    justify-content: flex-end;
    padding-bottom: 35px;

    .subtitles {
      padding-top: 5px;
      width: 600px;
      overflow: hidden;
      position: relative;
      //box-shadow: 0px 5px 25px 5px rgb(0 0 0 / 80%);
      background-color: rgba(0, 0, 0, 50%);
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }

    .tool {
      margin: 10px 0 0 0;
    }
  }

  .footer {
    height: 200px;
  }

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex: 1;
  }
`;

export default function App({ defaultLang }) {
  const subtitleHistory = useRef([]);
  const notificationSystem = useRef(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState('');
  const [processing, setProcessing] = useState(0);
  const [language, setLanguage] = useState(defaultLang);
  const [speakers, setSpeakersOriginal] = useState([
    new Speaker({ id: 1, name: 'Speaker 1' }),
    new Speaker({ id: 2, name: 'Speaker 2' }),
  ]);
  const [preset, setPreset] = useState('');
  const [subtitle, setSubtitleOriginal] = useState([]);
  const [waveform, setWaveform] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [settings, setSettingsOriginal] = useState(new Settings({}));
  const [langs, setLangs] = useState([]);
  const [currentLang, setCurrentLang] = useState(null);

  const newSub = useCallback((item) => {
    if (!item.speaker) {
      item.speaker = settings.currentSpeaker;
    }
    return new Sub(item);
  }, [settings.currentSpeaker]);
  const newSpeaker = useCallback((item) => new Speaker(item), []);
  const hasSub = useCallback((sub) => subtitle.indexOf(sub), [subtitle]);

  const formatSub = useCallback(
    (sub) => {
      if (Array.isArray(sub)) {
        return sub.map((item) => newSub(item));
      }
      return newSub(sub);
    },
    [newSub],
  );

  const formatSpeakers = useCallback(
    (speakers) => {
      if (Array.isArray(speakers)) {
        return speakers.map((item) => newSpeaker(item));
      }
      return newSpeaker(speakers);
    },
    [newSpeaker],
  );

  const copySubs = useCallback(() => formatSub(subtitle), [subtitle, formatSub]);
  const copySpeakers = useCallback(() => formatSpeakers(speakers), [speakers, formatSpeakers]);

  const setSubtitle = useCallback(
    (newSubtitle, saveToHistory = true) => {
      if (!isEqual(newSubtitle, subtitle)) {
        if (saveToHistory) {
          if (subtitleHistory.current.length >= 1000) {
            subtitleHistory.current.shift();
          }
          subtitleHistory.current.push(formatSub(subtitle));
        }
        window.localStorage.setItem('subtitle', JSON.stringify(newSubtitle));
        setSubtitleOriginal(newSubtitle);
      }
    },
    [subtitle, setSubtitleOriginal, formatSub],
  );

  const setSpeakers = useCallback(
    (newSpeakers, force = false) => {
      if (force || !isEqual(newSpeakers, speakers)) {
        window.localStorage.setItem('speakers', JSON.stringify(newSpeakers));
        setSpeakersOriginal(newSpeakers);
      }
    },
    [speakers, setSpeakersOriginal],
  );

  const setSettings = useCallback(
    (settingsPatch) => {
      const newSettings = new Settings({ ...settings, ...settingsPatch });
      if (!isEqual(newSettings, settings)) {
        window.localStorage.setItem('settings', JSON.stringify(newSettings));
        setSettingsOriginal(newSettings);
      }
    }, [settings, setSettingsOriginal]);

  const undoSubs = useCallback(() => {
    const subs = subtitleHistory.current.pop();
    if (subs) {
      setSubtitle(subs, false);
    }
  }, [setSubtitle, subtitleHistory]);

  const clearSubs = useCallback(() => {
    setSubtitle([]);
    subtitleHistory.current.length = 0;
  }, [setSubtitle, subtitleHistory]);

  const checkSub = useCallback(
    (sub) => {
      const index = hasSub(sub);
      if (index < 0) return;
      const previous = subtitle[index - 1];
      return (previous && sub.startTime < previous.endTime) || !sub.isValid || sub.duration < 0.2;
    },
    [subtitle, hasSub],
  );

  const notify = useCallback(
    (obj) => {
      // https://github.com/igorprado/react-notification-system
      const notification = notificationSystem.current;
      notification.clearNotifications();
      notification.addNotification({
        position: 'tc',
        dismissible: 'none',
        autoDismiss: 2,
        message: obj.message,
        level: obj.level,
      });
    },
    [notificationSystem],
  );

  const removeSub = useCallback(
    (sub) => {
      const index = hasSub(sub);
      if (index < 0) return;
      const subs = copySubs();
      subs.splice(index, 1);
      setSubtitle(subs);
    },
    [hasSub, copySubs, setSubtitle],
  );

  const addSub = useCallback(
    (index, sub) => {
      const subs = copySubs();
      subs.splice(index, 0, formatSub(sub));
      setSubtitle(subs);
    },
    [copySubs, setSubtitle, formatSub],
  );

  const updateSub = useCallback(
    (sub, obj) => {
      const index = hasSub(sub);
      if (index < 0) return;
      const subs = copySubs();
      const subClone = formatSub(sub);
      Object.assign(subClone, obj);
      if (subClone.isValid) {
        subs[index] = subClone;
        setSubtitle(subs);
      }
    },
    [hasSub, copySubs, setSubtitle, formatSub],
  );

  const mergeSub = useCallback(
    (sub) => {
      const index = hasSub(sub);
      if (index < 0) return;
      const subs = copySubs();
      const next = subs[index + 1];
      if (!next) return;
      const merge = newSub({
        start: sub.start,
        end: next.end,
        text: sub.text.trim() + '\n' + next.text.trim(),
      });
      subs[index] = merge;
      subs.splice(index + 1, 1);
      setSubtitle(subs);
    },
    [hasSub, copySubs, setSubtitle, newSub],
  );

  const splitSub = useCallback(
    (sub, start) => {
      const index = hasSub(sub);
      if (index < 0 || !sub.text || !start) return;
      const subs = copySubs();
      const text1 = sub.text.slice(0, start).trim();
      const text2 = sub.text.slice(start).trim();
      if (!text1 || !text2) return;
      const splitDuration = (sub.duration * (start / sub.text.length)).toFixed(3);
      if (splitDuration < 0.2 || sub.duration - splitDuration < 0.2) return;
      subs.splice(index, 1);
      const middleTime = DT.d2t(sub.startTime + parseFloat(splitDuration));
      subs.splice(
        index,
        0,
        newSub({
          start: sub.start,
          end: middleTime,
          text: text1,
        }),
      );
      subs.splice(
        index + 1,
        0,
        newSub({
          start: middleTime,
          end: sub.end,
          text: text2,
        }),
      );
      setSubtitle(subs);
    },
    [hasSub, copySubs, setSubtitle, newSub],
  );

  const patchSpeaker = useCallback(
    (id, patchValues) => {
      const index = speakers.findIndex(x => x.id === id);
      if (index < 0) return;
      const speakersCopy = [...speakers];
      const speaker = speakers[index];
      speakersCopy[index] = new Speaker({ ...speaker, ...patchValues });
      setSpeakers(speakersCopy, true);
    },
    [speakers, setSpeakers],
  );

  const onKeyDown = useCallback(
    (event) => {
      const keyCode = getKeyCode(event);
      switch (keyCode) {
        case 32:
          event.preventDefault();
          if (player) {
            if (playing) {
              player.pause();
            } else {
              player.play();
            }
          }
          break;
        case 90:
          event.preventDefault();
          if (event.metaKey) {
            undoSubs();
          }
          break;
        default:
          break;
      }
    },
    [player, playing, undoSubs],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  useMemo(() => {
    const sub = subtitle.find((item) => item.startTime <= currentTime && item.endTime > currentTime);
    setSettings({ currentSubtitle: sub?.id || -1 });
  }, [currentTime, subtitle, setSettings]);

  useEffect(() => {
    // ========= Speakers =========
    const localSpeakersString = window.localStorage.getItem('speakers');
    if (localSpeakersString) {
      try {
        const localSpeakers = JSON.parse(localSpeakersString);
        if (localSpeakers.length) {
          setSpeakersOriginal(localSpeakers.map((item) => new Speaker(item)));
        }
      } catch (error) {
        // ignore
      }
    }
    // setSpeakersOriginal([]);

    // ========= Settings =========
    const settingsString = window.localStorage.getItem('settings');
    if (settingsString) {
      try {
        const localSettings = JSON.parse(settingsString);
        if (localSettings && !isEmpty(localSettings)) {
          setSettingsOriginal(localSettings);
          const currentSpeaker = speakers.find(x => x.id === localSettings.currentSpeaker);
          setPreset(currentSpeaker?.preset || '');
        }
      } catch (error) {
        // ignore
      }
    }
    if (!settings || isEmpty(settingsString)) {
      setSettings(new Settings({}));
    }

    // ========= Subtitles =========
    const localSubtitleString = window.localStorage.getItem('subtitle');
    if (localSubtitleString) {
      try {
        const localSubtitle = JSON.parse(localSubtitleString);
        if (localSubtitle.length) {
          setSubtitleOriginal(localSubtitle.map((item) => new Sub(item)));
          return;
        }
      } catch (error) {
        // ignore
      }
    }
    setSubtitleOriginal([]);
  }, [setSubtitleOriginal, setSpeakersOriginal, setSettingsOriginal]);

  useEffect(() => {
    if (waveform && !isEmpty(settings)) {
      waveform.setOptions({
        scrollable: settings.scrollable || false,
        duration: +(settings.zoom || 1) * 5,
      });
    }
  }, [waveform, settings]);

  useEffect(() => {
    async function fetchLanguages() {
      const langs = await languagesApi.getAll('test');
      setLangs(langs);
    }

    if (!langs || langs.length === 0) {
      fetchLanguages();
    }
  }, [langs, setLangs]);

  useEffect(() => {
    if (!speakers?.length || !langs?.length) {
      return;
    }

    const speakersClone = [...speakers];
    for (let i = 0; i < speakersClone.length; i++) {
      if (speakersClone[i].locale && speakersClone[i].voice) {
        const speaker = new Speaker(speakersClone[i]);
        const lang = langs.find(x => x.locale === speaker.locale);
        const voice = lang.voices.find(x => x.key === speaker.voice);
        speaker.wordsPerMinute = voice.wordsPerMinute;
        speakersClone[i] = speaker;
      }
    }
    setSpeakers(speakersClone);
  }, [speakers, setSpeakers, langs]);

  const props = {
    player,
    setPlayer,
    subtitle,
    setSubtitle,
    waveform,
    setWaveform,
    currentTime,
    setCurrentTime,
    // currentIndex,
    // setCurrentIndex,
    playing,
    setPlaying,
    language,
    setLanguage,
    loading,
    setLoading,
    setProcessing,
    subtitleHistory,

    speakers,
    setSpeakers,
    patchSpeaker,
    newSpeaker,
    settings,
    setSettings,
    preset,
    setPreset,

    recording,
    setRecording,
    langs,
    setLangs,
    currentLang,
    setCurrentLang,

    notify,
    newSub,
    hasSub,
    checkSub,
    removeSub,
    addSub,
    undoSubs,
    clearSubs,
    updateSub,
    formatSub,
    mergeSub,
    splitSub,
  };

  return (
    <Style>
      <div className='main'>
        <div className='left'>
          <Header {...props} />
          <Player {...props} />
          <Tool {...props} />
        </div>
        <div className='subtitles'>
          <Subtitles {...props} />
          <Speakers {...props} />
        </div>
      </div>
      <Footer {...props} />
      {loading ? <Loading loading={loading} /> : null}
      {processing > 0 && processing < 100 ? <ProgressBar processing={processing} /> : null}
      <NotificationSystem ref={notificationSystem} allowHTML={true} />
    </Style>
  );
}
