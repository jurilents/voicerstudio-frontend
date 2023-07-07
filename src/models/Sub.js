import DT from 'duration-time-conversion';
import { v4 as uuidv4 } from 'uuid';
import { clamp } from 'lodash';

export const VoicedStatuses = {
  none: 'none',
  processing: 'processing',
  voiced: 'voiced',
  obsolete: 'obsolete',
};

export class Sub {
  constructor(obj) {
    this.id = obj.id || ('sub_' + uuidv4());
    this.speakerId = obj.speakerId;
    this.start = obj.start;
    this.startStr = DT.d2t(this.start);
    this.end = obj.end;
    this.endStr = DT.d2t(this.end);
    this.text = obj.text;
    this.note = obj.note;
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

  buildVoicedStamp(audioUrl) {
    return new VoicedSubStamp(this, audioUrl);
  }

  get voicedStatus() {
    if (this.data) {
      if (this.text === this.data.text
        && Math.abs((this.end - this.start) - (this.data.end - this.data.start)) < 0.001
        && this.audioUrl) {
        return VoicedStatuses.voiced;
      } else if (this.text !== this.data.text) {
        return VoicedStatuses.obsolete;
      }
    }
  }

  get voicedStatusColor() {
    const status = this.voicedStatus;
    if (status === VoicedStatuses.voiced) {
      return '#32b432';
    }
    if (status === VoicedStatuses.processing) {
      return '#b4a332';
    }
    if (status === VoicedStatuses.none) {
      return '#817777';
    }
    if (status === VoicedStatuses.obsolete) {
      return '#b44a32';
    }
    return '#a8a8a8';
  }
}

export class VoicedSubStamp {
  constructor(obj, audioUrl) {
    this.text = obj.text;
    this.start = obj.start;
    this.end = obj.end;
    this.src = audioUrl || obj.src;
  }

  equalTo(target) {
    return target
      && this.text === target.text
      && this.start === target.start
      && this.end === target.end;
  }
}
