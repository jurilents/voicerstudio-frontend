import palette from '../styles/palette';

export const VoicedStatuses = {
  none: 'none',
  processing: 'processing',
  voiced: 'voiced',
  obsolete: 'obsolete',
};

export function getSubVoicedStatus(sub) {
  if (sub.data) {
    if (sub.data === VoicedStatuses.processing) {
      return VoicedStatuses.processing;
    }
    if (sub.data.src === VoicedStatuses.voiced) {
      return VoicedStatuses.voiced;
    }
    if (sub.text.trim() === sub.data.text
      // && Math.abs((sub.end - sub.start) - (sub.data.end - sub.data.start)) < 0.001
      && sub.data.src) {
      return VoicedStatuses.voiced;
    } else if (sub.text !== sub.data.text) {
      return VoicedStatuses.obsolete;
    }
  }

  return VoicedStatuses.none;
}

export function canSubBeVoiced(sub) {
  const status = getSubVoicedStatus(sub);
  return status === VoicedStatuses.none
    || status === VoicedStatuses.obsolete
    || status === VoicedStatuses.processing;
}

export function getSubVoicedStatusColor(sub) {
  const status = getSubVoicedStatus(sub);
  if (status === VoicedStatuses.voiced) return palette.statusColors.ok;
  if (status === VoicedStatuses.processing) return palette.statusColors.warn;
  if (status === VoicedStatuses.none) return palette.statusColors.temp;
  if (status === VoicedStatuses.obsolete) return palette.statusColors.danger;
  return palette.statusColors.none;
}

export function validateSubs(subs) {
  let prev = null;
  for (let i = 0; i < subs.length; i++) {
    const curr = subs[i];
    const next = subs[i + 1];
    if (prev) curr.invalidStart = curr.start < prev.end;
    if (next) curr.invalidEnd = curr.end > next.start;
    prev = curr;
  }
}

export function allSubsAreValid(subs) {
  for (const sub of subs) {
    if (!(sub.start >= 0
      && sub.end >= 0
      && sub.start < sub.end
      && !sub.invalidStart
      && !sub.invalidEnd)) {
      return false;
    }
  }

  return true;
}

export function sortSubs(subs) {
  subs.sort((a, b) => a.start - b.start);
}
