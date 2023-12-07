import DT from 'duration-time-conversion';
import {v4 as uuidv4} from 'uuid';
import {clamp} from 'lodash';
import {effectKeys} from '../utils/timelineEffects';
import {settings} from '../settings';
import {canSubBeVoiced, getSubVoicedStatus, getSubVoicedStatusColor} from './Sub.functions';

export class Sub {
  constructor(obj) {
    this.id = obj.id || 'sub_' + uuidv4();
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
    return this.start >= 0 && this.end >= 0 && this.start < this.end && !this.invalidStart && !this.invalidEnd;
  }

  get clone() {
    return new Sub(this);
  }

  set startTime(time) {
    if (this.start === time) return;
    this.start = +time.toFixed(3);

    const duration = this.duration;
    const minDuration = this.minDuration;
    const maxDuration = this.maxDuration;
    if (minDuration && duration < minDuration) this.start = +(this.end - minDuration).toFixed(3);
    else if (maxDuration && duration > maxDuration) this.start = +(this.end - maxDuration).toFixed(3);
    this.startStr = DT.d2t(clamp(this.start, 0, Infinity));
    this.recalcRate();
  }

  set endTime(time) {
    if (this.end === time) return;
    this.end = +time.toFixed(3);

    const duration = this.duration;
    const minDuration = this.minDuration;
    const maxDuration = this.maxDuration;
    if (minDuration && duration < minDuration) this.end = +(this.start + minDuration).toFixed(3);
    else if (maxDuration && duration > maxDuration) this.end = +(this.start + maxDuration).toFixed(3);
    this.endStr = DT.d2t(clamp(this.end, 0, Infinity));
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
      this.speedRate = this.duration / this.data.baseDuration;
    } else {
      this.speedRate = 1;
    }
  }

  buildVoicedStamp(audioUrl, baseDuration) {
    const speakerSpeed = window.speakersData?.[this.speakerId]?.speed || 0;
    return new VoicedSubStamp(this, audioUrl, baseDuration / (1 + speakerSpeed));
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
    return target && this.text === target.text && this.start === target.start && this.end === target.end;
  }
}
