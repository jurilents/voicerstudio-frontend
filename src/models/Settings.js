export default class Settings {
  constructor(obj) {
    this.currentSpeaker = obj.currentSpeaker || 1;
    this.scrollable = obj.scrollable || true;
    this.magnet = obj.magnet || false;
    this.zoom = obj.zoom || 1;
  }
}
