import { Howl } from 'howler';

class AudioController {
  // cacheMap = {};
  // listenerMap = {};

  constructor() {
    if (!window.cacheMap) window.cacheMap = {};
    if (!window.listenerMap) window.listenerMap = {};
  }

  start({ speakerId, id, src, startTime, time, speedRate, volume, engine }) {
    const cached = this._getCachedSpeaker(speakerId);
    const cachedListeners = this._getCachedSpeakerListeners(speakerId);
    let item = cached[id];
    if (!speedRate) speedRate = 1;
    // if (Math.abs(speedRate) > 0.1) speedRate *= 1.0001;
    console.log('rate:::', speedRate);

    if (item && item._src === src) {
      item.rate(engine.getPlayRate() * speedRate);
      item.volume(volume);
      item.seek((time - startTime) % item.duration());
      item.play();
      console.log('engine.getPlayRate() * speedRate 1', item._rate);
    } else {
      item = new Howl({
        src: src,
        format: 'wav',
        loop: false,
        autoplay: true,
        volume: volume,
        html5: true,
      });
      cached[id] = item;
      item.on('load', () => {
        item.rate(engine.getPlayRate() * speedRate);
        item.seek((time - startTime) % item.duration());
        console.log('engine.getPlayRate() * speedRate 2', item._rate);
      });
    }

    console.log('item', item._rate);

    const timeListener = ({ time }) => {
      item.seek(time);
    };
    const rateListener = ({ rate }) => {
      item.rate(rate * speedRate);
    };
    if (!cachedListeners[id]) cachedListeners[id] = {};
    engine.on('afterSetTime', timeListener);
    engine.on('afterSetPlayRate', rateListener);
    cachedListeners[id].time = timeListener;
    cachedListeners[id].rate = rateListener;
  }

  setSpeakerVolume({ speakerId, volume }) {
    const cachedSpeaker = this._getCachedSpeaker(speakerId);
    if (cachedSpeaker) {
      for (const item of Object.values(cachedSpeaker)) {
        item.volume(volume);
      }
    }
  }

  stop({ speakerId, id, engine }) {
    const item = this._getCachedSpeaker(speakerId)[id];
    const cachedListeners = this._getCachedSpeakerListeners(speakerId);

    if (item) {
      item.stop();
      if (cachedListeners[id]) {
        cachedListeners[id].time && engine.off('afterSetTime', cachedListeners[id].time);
        cachedListeners[id].rate && engine.off('afterSetPlayRate', cachedListeners[id].rate);
        delete cachedListeners[id];
      }
    }
  }

  _getCachedSpeaker(speakerId) {
    if (!window.cacheMap[speakerId])
      window.cacheMap[speakerId] = {};
    return window.cacheMap[speakerId];
  }

  _getCachedSpeakerListeners(speakerId) {
    if (!window.listenerMap[speakerId])
      window.listenerMap[speakerId] = {};
    return window.listenerMap[speakerId];
  }
}

export default new AudioController();
