import {sortSubs, Sub, validateSubs} from '../models';
import {toast} from 'react-toastify';
import {mergeSub} from './sessionReducer';

const subsReducer = {
  setAllSubs: (state, action) => {
    const speaker = state.speakers[action.payload.speakerId];
    speaker.subs = action.payload.subs;
    return {...state};
  },

  addSub: (state, action) => {
    if (!action.payload.sub) {
      console.warn('Sub add invocation unexpected');
      return state;
    }
    const speaker = state.speakers.find((x) => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      toast.error('Cannot add sub to undefined speaker.');
      return state;
    }
    speaker.subs = [...(speaker.subs || []), action.payload.sub];
    sortSubs(speaker.subs);
    validateSubs(speaker.subs);

    const session = {...state};
    session.selectedSub = action.payload.sub;
    return session;
  },

  removeSub: (state, action) => {
    const speaker = state.speakers.find((x) => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      toast.error('Cannot remove sub of undefined speaker.');
      return state;
    }
    const index = speaker.subs.findIndex((x) => x.id === action.payload.sub.id);
    if (index === -1) return state;
    speaker.subs.splice(index, 1);
    validateSubs(speaker.subs);

    return {
      ...state,
      selectedSpeaker: speaker,
      selectedSub:
        speaker.subs.length > index
          ? speaker.subs[index]
          : speaker.subs.length > 0
            ? speaker.subs[speaker.subs.length - 1]
            : null,
    };
  },

  patchSub: (state, action) => {
    const speaker = state.speakers.find((x) => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      toast.error('Cannot patch sub of undefined speaker.');
      return state;
    }
    // speaker.subs = [...(speaker.subs || [])];
    const subIndex = speaker.subs.findIndex((x) => x.id === action.payload.sub.id);
    if (subIndex === -1) return state;
    const sub = speaker.subs[subIndex];
    speaker.subs[subIndex] = new Sub({...sub, ...action.payload.patch});

    if (action.payload.patch.start) {
      sortSubs(speaker.subs);
    }
    if (action.payload.patch.start || action.payload.patch.end) {
      validateSubs(speaker.subs);
    }

    return {
      ...state,
      speakers: [...state.speakers],
      selectedSpeaker: speaker,
      selectedSub: speaker.subs[subIndex],
    };
  },

  splitSub: (state, action, timeMachine) => {
    if (!action.payload.index) {
      return state;
    }
    const speaker = state.speakers.find((x) => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      toast.error('Cannot split sub of undefined speaker.');
      return state;
    }

    const subIndex = speaker.subs.findIndex((x) => x.id === action.payload.sub.id);
    if (subIndex === -1) return state;
    const sub = speaker.subs[subIndex];
    // If one of the fragments will left empty string, do not split the sub
    if (!sub.text.substring(0, action.payload.index).trim().length
      || !sub.text.substring(action.payload.index, sub.text.length).trim().length) {
      return state;
    }

    const splitDeltaTime = action.payload.index * sub.duration / sub.text.length;
    const splitTime = +(sub.start + splitDeltaTime).toFixed(3);
    console.log('splitTime', splitDeltaTime);

    // Patch previous sub
    speaker.subs[subIndex] = new Sub({
      ...sub,
      text: sub.text.substring(0, action.payload.index - 1),
      end: splitTime,
      data: null,
      invalidEnd: false,
    });

    // Create next sub
    const nextSub = new Sub({
      ...sub,
      id: null, // force constructor to generate a new ID
      data: null,
      invalidStart: false,
      text: sub.text.substring(action.payload.index, sub.text.length),
      start: splitTime,
      end: sub.end,
    });
    speaker.subs.push(nextSub);

    sortSubs(speaker.subs);
    timeMachine.push(action, mergeSub(action.payload.sub, nextSub));

    return {
      ...state,
      speakers: [...state.speakers],
      selectedSpeaker: speaker,
      selectedSub: speaker.subs[subIndex],
    };
  },

  mergeSub: (state, action) => {
    const speaker = state.speakers.find((x) => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      toast.error('Cannot merge subs of undefined speaker.');
      return state;
    }

    const subIndex = speaker.subs.findIndex((x) => x.id === action.payload.sub.id);
    const nextSubIndex = speaker.subs.findIndex((x) => x.id === action.payload.nextSub.id);
    if (subIndex === -1 || nextSubIndex === -1) return state;
    const sub = speaker.subs[subIndex];

    // Patch previous sub
    speaker.subs[subIndex] = new Sub({
      ...sub,
      // data: null,
      invalidEnd: action.payload.nextSub.invalidEnd,
      text: sub.text + action.payload.nextSub.text,
      end: action.payload.nextSub.end,
    });

    // Delete next sub
    speaker.subs.splice(nextSubIndex, 1);

    sortSubs(speaker.subs);

    return {
      ...state,
      speakers: [...state.speakers],
      selectedSpeaker: speaker,
      selectedSub: speaker.subs[subIndex],
    };
  },

  selectSub: (state, action) => {
    let speaker = state.speakers.find((x) => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      toast.error('Cannot select sub of undefined speaker.');
      return state;
    }
    if (!state.selectedSpeaker || state.selectedSpeaker.id !== action.payload.sub.speakerId) {
      speaker = state.speakers.find((x) => x.id === action.payload.sub.speakerId);
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
        startStr: sub.startStr,
        endStr: next.endStr,
        text: sub.text.trim() + '\n' + next.text.trim(),
      });
      subs[index] = merge;
      subs.splice(index + 1, 1);
      setSubtitle(subs);
    },
    [hasSub, copySubs, setSubtitle, newSub],
  );

  const splitSub = useCallback(
    (sub, startStr) => {
      const index = hasSub(sub);
      if (index < 0 || !sub.text || !startStr) return;
      const subs = copySubs();
      const text1 = sub.text.slice(0, startStr).trim();
      const text2 = sub.text.slice(startStr).trim();
      if (!text1 || !text2) return;
      const splitDuration = (sub.duration * (startStr / sub.text.length)).toFixed(3);
      if (splitDuration < 0.2 || sub.duration - splitDuration < 0.2) return;
      subs.splice(index, 1);
      const middleTime = DT.d2t(sub.startTime + parseFloat(splitDuration));
      subs.splice(
        index,
        0,
        newSub({
          startStr: sub.startStr,
          endStr: middleTime,
          text: text1,
        }),
      );
      subs.splice(
        index + 1,
        0,
        newSub({
          startStr: middleTime,
          endStr: sub.endStr,
          text: text2,
        }),
      );
      setSubtitle(subs);
    },
    [hasSub, copySubs, setSubtitle, newSub],
  );

*/

export default subsReducer;
