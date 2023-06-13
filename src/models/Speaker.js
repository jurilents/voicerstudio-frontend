export default class Speaker {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
  }

  get clone() {
    return new Speaker(this);
  }
}
