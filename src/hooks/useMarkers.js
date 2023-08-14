import { usePlayPause } from './usePlayPause';

export const useMarkers = (player) => {
  const { pause } = usePlayPause(player);

  function goToMarker(marker) {
    if (!window.timelineEngine) return;
    pause();
    window.timelineEngine.setTime(marker.time);
  }

  return { goToMarker };
};

