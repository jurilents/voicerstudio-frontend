import { Sub } from '../models';

const subsReducer = {
  setAllSubs: (state, action) => {
    const speaker = state.speakers[action.payload.speakerId];
    speaker.subs = action.payload.subs;
    return { ...state };
  },
  addSub: (state, action) => {
    if (!action.payload.sub) {
      console.warn('Sub add invocation unexpected');
      return state;
    }
    const speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot add subs to undefined speaker.');
    }
    speaker.subs = [...(speaker.subs || []), action.payload.sub];
    const session = { ...state };
    session.selectedSub = action.payload.sub;
    return session;
  },
  removeSub: (state, action) => {
    const speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot remove subs of undefined speaker.');
    }
    const index = speaker.subs.findIndex(x => x.id === action.payload.sub.id);
    if (index < 0) {
      return state;
    }
    speaker.subs.splice(index, 1);
    return {
      ...state,
      selectedSpeaker: speaker,
      selectedSub: speaker.subs.length > index
        ? speaker.subs[index]
        : speaker.subs.length > 0
          ? speaker.subs[speaker.subs.length - 1]
          : null,
    };
  },
  patchSub: (state, action) => {
    const speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot remove subs of undefined speaker.');
    }
    speaker.subs = [...(speaker.subs || [])];
    const subIndex = speaker.subs.findIndex(x => x.id === action.payload.sub.id);
    if (subIndex === -1) {
      return;
    }
    const sub = speaker.subs[subIndex];
    speaker.subs[subIndex] = new Sub({ ...sub, ...action.payload.patch });
    return { ...state };
  },
  selectSub: (state, action) => {
    let speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot remove subs of undefined speaker.');
    }
    if (!state.selectedSpeaker || state.selectedSpeaker.id !== action.payload.sub.speakerId) {
      speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    }
    return {
      ...state,
      selectedSpeaker: speaker,
      selectedSub: action.payload.sub,
    };
  },
};

/*

  const newSub = useCallback((item) => {
    if (!item.speaker) {
      item.speaker = settings.currentSpeaker;
    }
    return new Sub(item);
  }, [settings.currentSpeaker]);

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

  const copySubs = useCallback(() => formatSub(subtitle), [subtitle, formatSub]);

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

*/


export default subsReducer;
