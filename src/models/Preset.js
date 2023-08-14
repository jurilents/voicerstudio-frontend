import { parsePreset } from '../utils/presetParser';

export class Preset {
  constructor(obj) {
    this.id = obj.id;
    this.service = obj.service;
    this.displayName = obj.displayName;
    this.locale = obj.locale;
    this.voice = obj.voice;
    this.style = obj.style;
    this.styleDegree = obj.styleDegree;
    this.pitch = obj.pitch;
    this.speed = obj.speed;
    this.volume = obj.volume;
    this.wordsPerMinute = obj.wordsPerMinute;
    this.token = obj.token; // buildPreset();
  }

  static parse(str) {
    if (typeof str !== 'string') {
      throw new Error(`Preset.parse(str) invalid argument of type '${typeof str}' provided`);
    }

    const presetParts = str.split(': ');
    let presetPayload;
    let displayName = 'Azure Speaker Preset';
    if (presetParts.length > 1) {
      displayName = presetParts[0];
      presetPayload = presetParts[1];
    } else {
      presetPayload = presetParts[0];
    }
    const speechConfig = parsePreset(presetPayload);

    return new Preset({
      service: 'azure',
      locate: speechConfig[1],
      voice: `${speechConfig[1]}-${speechConfig[2]}`,
      token: str,
      displayName,
      style: speechConfig[3],
      styleDegree: +speechConfig[4],
      // role: 'string',
      pitch: +speechConfig[5],
      // volume: +speechConfig[6],
    });
  }
}
