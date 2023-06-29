export class Speaker {
  constructor(obj) {
    this.id = obj.id;
    this.displayName = obj.displayName;
    this.color = obj.color;
    this.preset = obj.preset;
    this.wordsPerMinute = obj.wordsPerMinute;
  }

  get clone() {
    return new Speaker(this);
  }
}
