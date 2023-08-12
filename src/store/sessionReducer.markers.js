import { Marker } from '../models';

function approximatelyEquals(a, b) {
  return Math.round(a) === Math.round(b);
}

const markersReducer = {
  setMarker: (state, action) => {
    // Check if remove
    if (state.markers.length > 0) {
      const diffMarkers = state.markers.filter(x => !approximatelyEquals(x.time, action.payload.marker.time));
      if (state.markers.length !== diffMarkers.length) {
        // Remove
        return {
          ...state,
          markers: diffMarkers,
        };
      }
    }

    // Otherwise just add the new one
    const newMarkers = [...state.markers, action.payload.marker];
    newMarkers.sort((a, b) => a.time - b.time);
    return {
      ...state,
      markers: newMarkers,
    };
  },
  patchMarker: (state, action) => {
    const index = state.markers.findIndex(x => x.id === action.payload.marker.id);
    if (index < 0) return;
    const markersCopy = [...state.markers];
    const marker = state.markers[index];
    markersCopy[index] = new Marker({ ...marker, ...action.payload.patch });
    return {
      ...state,
      markers: markersCopy,
    };
  },
};

export default markersReducer;
