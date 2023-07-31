import DT from 'duration-time-conversion';
import { v4 as uuidv4 } from 'uuid';
import { clamp } from 'lodash';
import { effectKeys } from '../utils/timelineEffects';

export const VoicedStatuses = {
  none: 'none',
  processing: 'processing',
  voiced: 'voiced',
  obsolete: 'obsolete',
};

export function getSubVoicedStatus(sub) {
  if (sub.data) {
    if (sub.data === VoicedStatuses.processing) {
      return VoicedStatuses.processing;
    }
    if (sub.data.src === VoicedStatuses.voiced) {
      return VoicedStatuses.voiced;
    }
    if (sub.text.trim() === sub.data.text
      && Math.abs((sub.end - sub.start) - (sub.data.end - sub.data.start)) < 0.001
      && sub.data.src) {
      return VoicedStatuses.voiced;
    } else if (sub.text !== sub.data.text) {
      return VoicedStatuses.obsolete;
    }
  }

  return VoicedStatuses.none;
}

export function canSubBeVoiced(sub) {
  const status = getSubVoicedStatus(sub);
  return status === VoicedStatuses.none || status === VoicedStatuses.obsolete;
}

export function getSubVoicedStatusColor(sub) {
  const status = getSubVoicedStatus(sub);
  if (status === VoicedStatuses.voiced) return '#32b432';
  if (status === VoicedStatuses.processing) return '#e8cb09';
  if (status === VoicedStatuses.none) return '#817777';
  if (status === VoicedStatuses.obsolete) return '#c93d1e';
  return '#a8a8a8';
}

export class Sub {
  constructor(obj) {
    this.id = obj.id || ('sub_' + uuidv4());
    this.speakerId = obj.speakerId;
    this.effectId = effectKeys.audioTrack;
    this.start = obj.start;
    this.startStr = DT.d2t(this.start);
    this.end = obj.end;
    this.endStr = DT.d2t(this.end);
    this.text = obj.text;
    this.note = obj.note;
    this.data = obj.data;
  }

  get isValid() {
    return this.start >= 0 && this.end >= 0 && this.start < this.end;
  }

  get clone() {
    return new Sub(this);
  }

  set startTime(time) {
    this.start = time;
    this.startStr = DT.d2t(clamp(time, 0, Infinity));
  }

  set endTime(time) {
    this.end = time;
    this.endStr = DT.d2t(clamp(time, 0, Infinity));
  }

  get duration() {
    return parseFloat((this.end - this.start).toFixed(3));
  }

  buildVoicedStamp(audioUrl, baseDuration) {
    return new VoicedSubStamp(this, audioUrl, baseDuration);
  }

  get voicedStatus() {
    return getSubVoicedStatus(this);
  }

  get canBeVoiced() {
    return canSubBeVoiced(this);
  }

  get voicedStatusColor() {
    return getSubVoicedStatusColor(this);
  }
}

export class VoicedSubStamp {
  constructor(obj, audioUrl, baseDuration) {
    this.text = obj.text?.trim();
    this.start = obj.start;
    this.end = obj.end;
    this.src = audioUrl || obj.src;
    this.baseDuration = baseDuration || obj.baseDuration;
  }

  equalTo(target) {
    return target
      && this.text === target.text
      && this.start === target.start
      && this.end === target.end;
  }
}
