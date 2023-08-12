export const useMarkers = (player) => {
  function goToMarker(marker) {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    engine.pause();
    if (!player.paused) player.pause();
    engine.setTime(marker.time);
  }

  return { goToMarker };
};

