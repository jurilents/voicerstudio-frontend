import DT from 'duration-time-conversion';

export const userAgent = window.navigator.userAgent;
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

export function getExt(url) {
  return url.trim().toLowerCase().split('.').pop();
}

export function sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function download(url, name) {
  const elink = document.createElement('a');
  elink.style.display = 'none';
  elink.href = url;
  elink.download = name;
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
}

export function getKeyCode(event) {
  const tag = document.activeElement.tagName.toUpperCase();
  const editable = document.activeElement.getAttribute('contenteditable');
  if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
    return Number(event.keyCode);
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
  const wordsCount = !text ? 0 : text.trim().split(/\s+/).length;
  const wordsPerSecond = wordsPerMinute / 60;
  const predictedSeconds = wordsCount / wordsPerSecond;
  return d2t(predictedSeconds);
}

export function d2t(time) {
  time = time === Infinity ? 0 : time;
  const displayValue = DT.d2t(time);
  return displayValue.substring(0, displayValue.length - 1);
}
