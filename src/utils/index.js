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

export function download(url, exportName) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = exportName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadObjectAsJson(obj, exportName, exportExtension = 'json') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.${exportExtension}`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function getKeyCode(event) {
  const tag = document.activeElement.tagName.toUpperCase();
  // const editable = document.activeElement.getAttribute('contenteditable');
  if ((tag !== 'INPUT' && tag !== 'TEXTAREA') || document.activeElement.type === 'range') {
    return event.code.toUpperCase();
  }
}

export function isPlaying($video) {
  return !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2);
}

export function replaceAt(str, index, replacement) {
  if (index > str.length - 1) return str;
  console.log('index:', index);
  return str.substring(0, index) + replacement + str.substring(index + 1);
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

export function toPercentsDelta(num, sign, accuracy = 0) {
  num = toPercentsNumber(num, accuracy);
  return (num > 0 ? (sign ? '+' : '') + num : num) + '%';
}

export function toPercentsNumber(num, accuracy = 0) {
  return (num * 100).toFixed(accuracy);
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

export function time2seconds(timeStr) {
  if (typeof timeStr !== 'string') return 0;
  let ms = 0;
  if (timeStr.includes('.')) {
    const parts = timeStr.split('.');
    timeStr = parts[0];
    ms = +('0.' + parts[1]);
  }
  return timeStr.split(':').reduce((acc, time) => (60 * acc) + +time) + ms;
}

export function isBool(value) {
  return value === true || value === false;
}

export function getDurationStatusColor(durationCoef) {
  if (isNaN(+durationCoef)) durationCoef = 1;
  // durationCoef = Math.abs(durationCoef);

  // -15% to -inf
  if (durationCoef < -0.1501) return palette.indicatorColors.highest;
  // -10% to -15%
  if (durationCoef < -0.1001) return palette.indicatorColors.higher;
  // -1% to -10%
  if (durationCoef < -0.01) return palette.indicatorColors.high;
  // -1% to +1%
  if (durationCoef < 0.01) return palette.indicatorColors.zero;
  // +1% to 10%
  if (durationCoef < 0.1001) return palette.indicatorColors.low;
  // +10% to 15%
  if (durationCoef < 0.1501) return palette.indicatorColors.lower;
  // +15% to +inf
  return palette.indicatorColors.lowest;
}
