export class Marker {
  constructor(obj) {
    this.id = obj.id || 0;
    this.text = obj.text;
    this.color = obj.color;
    this.time = obj.time;
  }
}
