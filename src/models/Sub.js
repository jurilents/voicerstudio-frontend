import clamp from 'lodash/clamp';
import DT from 'duration-time-conversion';
import { v4 as uuidv4 } from 'uuid';

export class Sub {
  constructor(obj) {
    this.id = obj.id || ('sub_' + uuidv4());
    this.speakerId = obj.speakerId;
    this.start = obj.start;
    this.end = obj.end;
    this.text = obj.text;
    this.note = obj.note;
    this.voicedStamp = obj.voicedStamp;
  }

  get isValid() {
    return this.startTime >= 0 && this.endTime >= 0 && this.startTime < this.endTime;
  }

  get clone() {
    return new Sub(this);
  }

  get startTime() {
    return DT.t2d(this.start);
  }

  set startTime(time) {
    this.start = DT.d2t(clamp(time, 0, Infinity));
  }

  get endTime() {
    return DT.t2d(this.end);
  }

  set endTime(time) {
    this.end = DT.d2t(clamp(time, 0, Infinity));
  }

  get duration() {
    return parseFloat((this.endTime - this.startTime).toFixed(3));
  }

  buildVoicedStamp(audioUrl) {
    return new VoicedSubStamp(this, audioUrl);
  }

  get voicedStatus() {
    if (this.text === this.voicedStamp?.text) {}
    // TODO: return value here
  }
}

export class VoicedSubStamp {
  constructor(obj, audioUrl) {
    this.text = obj.text;
    this.start = obj.start;
    this.end = obj.end;
    this.audioUrl = obj.audioUrl || audioUrl;
  }

  equalTo(target) {
    return target
      && this.text === target.text
      && this.start === target.start
      && this.end === target.end;
  }
}
