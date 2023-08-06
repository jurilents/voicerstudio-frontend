import DT from 'duration-time-conversion';
import { v4 as uuidv4 } from 'uuid';
import { clamp } from 'lodash';
import { effectKeys } from '../utils/timelineEffects';
import palette from '../styles/palette';
import { settings } from '../settings';

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
      // && Math.abs((sub.end - sub.start) - (sub.data.end - sub.data.start)) < 0.001
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
  return status === VoicedStatuses.none
    || status === VoicedStatuses.obsolete
    || status === VoicedStatuses.processing;
}

export function getSubVoicedStatusColor(sub) {
  const status = getSubVoicedStatus(sub);
  if (status === VoicedStatuses.voiced) return palette.statusColors.ok;
  if (status === VoicedStatuses.processing) return palette.statusColors.warn;
  if (status === VoicedStatuses.none) return palette.statusColors.temp;
  if (status === VoicedStatuses.obsolete) return palette.statusColors.danger;
  return palette.statusColors.none;
}


export class Sub {
  constructor(obj) {
    this.id = obj.id || ('sub_' + uuidv4());
    this.speakerId = obj.speakerId;
    this.effectId = effectKeys.audioTrack;
    this.text = obj.text;
    this.note = obj.note;
    this.data = obj.data;
    this.start = obj.start;
    this.startStr = DT.d2t(clamp(this.start, 0, Infinity));
    this.endTime = obj.end;
    this.invalidStart = obj.invalidStart;
    this.invalidEnd = obj.invalidEnd;
  }

  get isValid() {
    return this.start >= 0
      && this.end >= 0
      && this.start < this.end
      && !this.invalidStart
      && !this.invalidEnd;
  }

  get clone() {
    return new Sub(this);
  }

  set startTime(time) {
    if (this.start === time) return;
    this.start = time;

    const duration = this.duration;
    const minDuration = this.minDuration;
    const maxDuration = this.maxDuration;
    console.log('min', minDuration);
    console.log('max', maxDuration);
    if (minDuration && duration < minDuration) this.start = this.end - minDuration;
    else if (maxDuration && duration > maxDuration) this.start = this.end - maxDuration;
    console.log('this.start', this.start);
    this.startStr = DT.d2t(clamp(this.start, 0, Infinity));
    this.recalcRate();
  }

  set endTime(time) {
    if (this.end === time) return;
    this.end = time;

    const duration = this.duration;
    const minDuration = this.minDuration;
    const maxDuration = this.maxDuration;
    if (minDuration && duration < minDuration) this.end = this.start + minDuration;
    else if (maxDuration && duration > maxDuration) this.end = this.start + maxDuration;
    this.endStr = DT.d2t(clamp(time, 0, Infinity));
    this.recalcRate();
  }

  get duration() {
    return this.end - this.start;
  }

  get minDuration() {
    if (this.data && !isNaN(+this.data?.baseDuration)) {
      return this.data.baseDuration * (1 - settings.rateLimit);
    }
    return null;
  }

  get maxDuration() {
    if (this.data && !isNaN(+this.data?.baseDuration)) {
      console.log('1 + settings.rateLimit', 1 / (this.data.baseDuration * (1 + settings.rateLimit)));
      return this.data.baseDuration * (1 + settings.rateLimit);
    }
    return null;
  }

  get rate() {
    if (!this.speedRate) this.recalcRate();
    return this.speedRate;
  }

  recalcRate() {
    if (this.data && !isNaN(+this.data?.baseDuration)) {
      this.speedRate = (this.duration / this.data.baseDuration);
    } else {
      this.speedRate = 1;
    }
    console.log(`${this.speedRate} ::::: ${this.text} :::::`);
  }

  buildVoicedStamp(audioUrl, baseDuration) {
    console.log('baseDuration', baseDuration);
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
