import { Howl } from 'howler';

class AudioController {
  cacheMap = {};
  listenerMap = {};

  start({ speakerId, id, src, startTime, time, volume, engine }) {
    const cached = this._getCachedSpeaker(speakerId);
    let item = cached[id];

    if (item) {
      item.rate(engine.getPlayRate());
      item.volume(volume);
      item.seek((time - startTime) % item.duration());
      item.play();
    } else {
      item = new Howl({
        src: src,
        format: 'wav',
        loop: false,
        autoplay: true,
        volume: volume,
        // html5: true,
      });
      cached[id] = item;
      item.on('load', () => {
        item.rate(engine.getPlayRate());
        item.seek((time - startTime) % item.duration());
      });
    }

    const timeListener = ({ time }) => {
      item.seek(time);
    };
    const rateListener = ({ rate }) => {
      item.rate(rate);
    };
    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on('afterSetTime', timeListener);
    engine.on('afterSetPlayRate', rateListener);
    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
  }

  setSpeakerVolume({ speakerId, volume }) {
    const cachedSpeaker = this._getCachedSpeaker(speakerId);
    console.log('map', this.cacheMap);
    console.log('cached:', speakerId);
    if (cachedSpeaker) {
      for (const item of Object.values(cachedSpeaker)) {
        console.log('volume:', item.getVolume());
        item.volume(volume);
      }
    }
  }

  stop({ speakerId, id, engine }) {
    const item = this._getCachedSpeaker(speakerId)[id];

    if (item) {
      item.stop();
      if (this.listenerMap[id]) {
        this.listenerMap[id].time && engine.off('afterSetTime', this.listenerMap[id].time);
        this.listenerMap[id].rate && engine.off('afterSetPlayRate', this.listenerMap[id].rate);
        delete this.listenerMap[id];
      }
    }
  }

  _getCachedSpeaker(speakerId) {
    if (!this.cacheMap[speakerId])
      this.cacheMap[speakerId] = {};
    return this.cacheMap[speakerId];
  }
}

export default new AudioController();
