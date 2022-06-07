import { SET_MAP_TYPE } from 'constants/ActionTypes';
import { MAP_TYPES } from 'rafaelComponents/MapTool/MapContainer/mapSettings';

export const nextMapType = currentMapType => {
  const mapArrayLength = MAP_TYPES.length;
  let currentIndex = MAP_TYPES.findIndex(mapType => mapType === currentMapType);
  if (currentIndex + 1 >= mapArrayLength) {
    currentIndex = -1;
  }
  return {
    type: SET_MAP_TYPE,
    mapType: MAP_TYPES[currentIndex + 1],
  };
};
