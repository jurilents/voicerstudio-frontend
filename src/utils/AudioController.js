import {Howl} from 'howler';

class AudioController {
  constructor() {
    if (!window.cacheMap) window.cacheMap = {};
    if (!window.listenerMap) window.listenerMap = {};
  }

  addFromSub(sub, engine) {
    if (!engine) {
      if (!window.timelineEngine) return;
      engine = window.timelineEngine;
    }
    this.add({
      speakerId: sub.speakerId,
      id: sub.id,
      src: sub.data?.src,
      startTime: sub.start,
      time: engine.getTime(),
      speedRate: 1,
      volume: 1,
      engine,
    });
  }

  add({speakerId, id, src, startTime, time, speedRate, volume, engine, autoplay}) {
    const cached = this._getCachedSpeaker(speakerId);
    const cachedListeners = this._getCachedSpeakerListeners(speakerId);
    let item = cached[id];
    if (!speedRate) speedRate = 1;

    if (!item || item._src !== src) {
      item = new Howl({
        src: src,
        format: 'wav',
        // loop: false,
        // autoplay: autoplay === true,
        // volume: volume,
        html5: true,
        onload: () => {
          console.log('loaded!');
          const rate = engine.getPlayRate() * speedRate;
          item.rate(rate);
          item.seek(((time - startTime) * rate) % (item.duration() * rate));
        },
      });
      cached[id] = item;
    }

    const timeListener = ({time}) => {
      item.seek(time);
    };
    const rateListener = ({rate}) => {
      item.rate(rate * speedRate);
    };
    if (!cachedListeners[id]) cachedListeners[id] = {};
    if (engine.listener) {
      engine.listener.on('afterSetTime', timeListener);
      engine.listener.on('afterSetPlayRate', rateListener);
    }
    cachedListeners[id].time = timeListener;
    cachedListeners[id].rate = rateListener;
  }

  start(params) {
    const {speakerId, id, src, startTime, time, speedRate, volume, engine} = params;
    const cached = this._getCachedSpeaker(speakerId);
    let item = cached[id];

    if (item && item._src === src) {
      item.volume(volume);
      const rate = engine.getPlayRate() * (speedRate ?? 1);
      item.rate(rate);
      item.seek(((time - startTime) * rate) % (item.duration() * rate));
      item.play();
    } else {
      params.autoplay = true;
      this.add(params);
    }
  }

  setSpeakerData({speakerId, volume, speedRate}) {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    const engineRate = engine.getPlayRate();
    const cachedSpeaker = this._getCachedSpeaker(speakerId);
    if (cachedSpeaker) {
      for (const item of Object.values(cachedSpeaker)) {
        item.volume(volume);
        item.rate(engineRate * speedRate);
      }
    }
  }

  stop({speakerId, id, engine}) {
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
    if (!window.cacheMap[speakerId]) window.cacheMap[speakerId] = {};
    return window.cacheMap[speakerId];
  }

  _getCachedSpeakerListeners(speakerId) {
    if (!window.listenerMap[speakerId]) window.listenerMap[speakerId] = {};
    return window.listenerMap[speakerId];
  }
}

export default new AudioController();
