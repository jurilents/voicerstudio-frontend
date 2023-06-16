export default class Speaker {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.preset = obj.preset;
    this.speechConfig = obj.speechConfig || {};
    this.lang = obj.lang;
  }

  get clone() {
    return new Speaker(this);
  }
}
