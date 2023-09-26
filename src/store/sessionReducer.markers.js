import { Marker } from '../models';
import timeMachine from '../utils/TimeMachine';
import { setMarker } from './sessionReducer';

function approximatelyEquals(a, b) {
  return Math.round(a) === Math.round(b);
}

const forceRemoveMarkerId = '__REMOVE';

function createRemoveMarker(time) {
  const removeMarker = new Marker({
    id: forceRemoveMarkerId,
    time: time,
  });
  removeMarker.fromHistory = true;
  return removeMarker;
}

const markersReducer = {
  setMarker: (state, action) => {
    // Check if remove
    if (state.markers.length > 0 || action.payload.marker.id === forceRemoveMarkerId) {
      const index = state.markers.findIndex(x => approximatelyEquals(x.time, action.payload.marker.time));
      if (index !== -1) {
        const targetMarker = state.markers[index];
        state.markers.splice(index, 1);

        if (!action.payload.marker.fromHistory) {
          timeMachine.push(setMarker(createRemoveMarker(targetMarker.time)), setMarker(targetMarker));
        }
        // Remove
        return {
          ...state,
          markers: [...state.markers],
        };
      }
    }

    // Otherwise just add the new one
    if (!action.payload.marker.fromHistory) {
      timeMachine.push(action, setMarker(createRemoveMarker(action.payload.marker.time)));
    }
    const newMarkers = [...state.markers, action.payload.marker];
    newMarkers.sort((a, b) => a.time - b.time);
    return {
      ...state,
      markers: newMarkers,
      selectedMarker: action.payload.marker,
    };
  },
  patchMarker: (state, action) => {
    const index = state.markers.findIndex(x => x.id === action.payload.marker.id);
    if (index < 0) return;
    const markersCopy = [...state.markers];
    const marker = state.markers[index];
    markersCopy[index] = new Marker({ ...marker, ...action.payload.patch });
    const selectedMarker = markersCopy[index];

    if (action.payload.patch.time) {
      markersCopy.sort((a, b) => a.time - b.time);
    }
    return {
      ...state,
      markers: markersCopy,
      selectedMarker: selectedMarker,
    };
  },
  selectMarker: (state, action) => {
    return {
      ...state,
      selectedMarker: action.payload.marker,
    };
  },
};

export default markersReducer;
