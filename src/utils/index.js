import DT from 'duration-time-conversion';
import palette from '../styles/palette';

export const userAgent = window.navigator.userAgent;
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

export function getExt(url) {
  return url.trim().toLowerCase().split('.').pop();
}

export function sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function download(url, name) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getKeyCode(event) {
  const tag = document.activeElement.tagName.toUpperCase();
  // const editable = document.activeElement.getAttribute('contenteditable');
  if (tag !== 'INPUT' && tag !== 'TEXTAREA' || document.activeElement.type === 'range') {
    return event.key.toUpperCase();
  }
}

export function isPlaying($video) {
  return !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2);
}

export function getWaveformZoomSteps(waveform) {
  if (!waveform) {
    return 1;
  }
  const step = 5;
  return Math.round(waveform.decoder.audiobuffer.duration / step);
}

export function predictDuration(text, wordsPerMinute) {
  if (!wordsPerMinute) {
    wordsPerMinute = 150;
  }
  const wordsCount = !text || typeof text !== 'string' ? 0 : text.trim().split(/\s+/).length;
  const wordsPerSecond = wordsPerMinute / 60;
  const predictedSeconds = wordsCount / wordsPerSecond;
  return d2t(predictedSeconds, true);
}

export function d2t(time, shorten) {
  time = typeof time !== 'number' || isNaN(time) || time === Infinity || time < 0 ? 0 : time;
  let displayValue = DT.d2t(time);
  if (shorten) {
    if (displayValue.startsWith('00:00:'))
      displayValue = displayValue.substring(6, displayValue.length);
    else if (displayValue.startsWith('00:'))
      displayValue = displayValue.substring(3, displayValue.length);
  }
  return displayValue.substring(0, displayValue.length - 1);
}

export function formatTime(time) {
  time = typeof time !== 'number' || isNaN(time) || time === Infinity || time < 0 ? 0 : time;
  let displayValue = DT.d2t(time);
  // if (displayValue.startsWith('00:00:'))
  //   displayValue = displayValue.substring(6, displayValue.length);
  if (displayValue.startsWith('00:'))
    displayValue = displayValue.substring(3, displayValue.length);
  return displayValue.substring(0, displayValue.length - 1);
}

export function toPercentsDelta(num, sign, extraAccuracy) {
  num = (num * 100).toFixed(extraAccuracy ? 1 : 0);
  return (num > 0 ? (sign ? '+' : '') + num : num) + '%';
}

export function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
}

export function cloneByKeys(obj, keysToClone) {
  const clone = {};
  for (const key of keysToClone) {
    clone[key] = obj[key];
  }
  return clone;
}

export function isBool(value) {
  return value === true || value === false;
}

export function getDurationStatusColor(durationCoef) {
  if (isNaN(+durationCoef)) durationCoef = 0;
  durationCoef = Math.abs(durationCoef);

  if (durationCoef < 0.1) return palette.statusColors.none;
  if (durationCoef <= 10) return palette.statusColors.ok;
  if (durationCoef <= 15) return palette.statusColors.warn;
  return palette.statusColors.danger;
}
