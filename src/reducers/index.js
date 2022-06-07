import { combineReducers } from 'redux';
import addressMarker from './addressMarker';
import baseData from './baseData';
import chartsFilter from './chartsFilter';
import clickedCoordinates from './clickedCoordinates';
import coordinateFetchStatus from './coordinateFetchStatus';
import coordinates from './coordinates';
import helpersCoordinates from './helpersCoordinates';
import company from './company';
import companyList from './companyList';
import filter from './filter';
import geofenceInProgress from './geofenceInProgress';
import geofences from './geofences';
import geofenceEditNodeMode from './geofenceEditNodeMode';
import helpersAllCoordinates from './helpersAllCoordinates';
import isControlsVisible from './isControlsVisible';
import isEditingGeofence from './isEditingGeofence';
import isSettingsOpen from './isSettingsOpen';
import isSignedIn from './isSignedIn';
import isFetchingCoordinates from './isFetchingCoordinates';
import isFiltersAutoRefreshing from './isFiltersAutoRefreshing';
import isFiltersPadded from './isFiltersPadded';
import isFullscreen from './isFullscreen';
import isModalOpen from './isModalOpen';
import isUserGeolocOn from './isUserGeolocOn';
import markerAnimationAndCircle from './markerAnimationAndCircle';
import mapType from './mapType';
import resetSlider from './resetSlider';
import serialNumber from './serialNumber';
import targetLastKnownCoords from './targetLastKnownCoords';
import theme from './theme';
import undoGeofenceInProgressItems from './undoGeofenceInProgressItems';
import userGeolocData from './userGeolocData';
import userPermissions from './userPermissions';
import userGroups from './userGroups';
import userRoles from './userRoles';
import setUserName from './setUserName';
import userData from './userData';
import setEditUserData from './setEditUserData';
import serviceSettings from './serviceSettings';
import emergencyRecordings from './emergencyRecordings';
import isEmergencyTracking from './isEmergencyTracking';
import deviceList from './deviceList';
import fetchRange from './fetchRange';
import toggles from './toggles';
import userCompany from './userCompany';
import userToken from './userToken';
import activeStatus from './activeStatus';
import devicePicker from './devicePicker';
import geofenceEditor from './geofenceEditor';
import spinner from './spinner';

const appReducer = combineReducers({
  addressMarker,
  baseData,
  chartsFilter,
  clickedCoordinates,
  company,
  companyList,
  coordinateFetchStatus,
  coordinates,
  deviceList,
  filter,
  geofenceEditNodeMode,
  geofenceInProgress,
  geofences,
  helpersCoordinates,
  helpersAllCoordinates,
  isControlsVisible,
  isEditingGeofence,
  isEmergencyTracking,
  isFetchingCoordinates,
  isFiltersAutoRefreshing,
  isFiltersPadded,
  isFullscreen,
  isModalOpen,
  isSettingsOpen,
  isSignedIn,
  isUserGeolocOn,
  mapType,
  markerAnimationAndCircle,
  resetSlider,
  serialNumber,
  targetLastKnownCoords,
  theme,
  undoGeofenceInProgressItems,
  userGeolocData,
  userGroups,
  userPermissions,
  userRoles,
  setUserName,
  userData,
  setEditUserData,
  emergencyRecordings,
  fetchRange,
  toggles,
  userCompany,
  userToken,
  activeStatus,
  devicePicker,
  serviceSettings,
  geofenceEditor,
  spinner,
});

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  if (!state?.userToken) {
    return appReducer({}, action);
  }
  return appReducer(state, action);
};
export default rootReducer;
