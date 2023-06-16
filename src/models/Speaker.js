export default class Speaker {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.preset = obj.preset;
    this.speechConfig = obj.speechConfig || {};
    if (Array.isArray(obj.speechConfig)) {
      this.locale = this.speechConfig[1];
      this.voice = `${this.speechConfig[1]}-${this.speechConfig[2]}`;
    }
    this.wordsPerMinute = obj.wordsPerMinute;
  }

  get clone() {
    return new Speaker(this);
  }
}
