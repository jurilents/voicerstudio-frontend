export class Settings {
  constructor(obj) {
    this.currentSpeaker = obj.currentSpeaker || 1;
    this.currentSubtitle = obj.currentSubtitle || -1;
    this.scrollable = obj.scrollable !== false;
    this.magnet = obj.magnet || false;
    this.zoom = obj.zoom || 1;
  }
}
