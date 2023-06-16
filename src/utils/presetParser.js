function toBase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

export function buildPreset(settings) {
  return toBase64(JSON.stringify(settings));
}

export function parsePreset(value) {
  return JSON.parse(fromBase64(value));
}
