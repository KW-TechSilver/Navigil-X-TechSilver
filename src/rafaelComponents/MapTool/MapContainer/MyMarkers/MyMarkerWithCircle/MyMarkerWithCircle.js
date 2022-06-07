/* eslint jsx-a11y/mouse-events-have-key-events: 0 */
import React, { useRef } from 'react';
import { Marker } from 'react-native-maps';
import { Text, View, Platform } from 'react-native';
import { getIcon } from '../../mapSettings';
import MarkerInfo from './MarkerInfo';

const UNSPECIFIED = '0';
const INITIAL = '1';
const FIRST = '2';
const FILTERED = '3';
const FINAL = '4';
const FAILED = '9';
const EMERGENCY_TRACKING = '10';

export const emergencyPositionTypes = {
  UNSPECIFIED,
  INITIAL,
  FIRST,
  FILTERED,
  FINAL,
  FAILED,
  EMERGENCY_TRACKING,
};

const IS_CELL_LOCATION = {
  130: { 3: true, 4: true },
  201: { 0: true },
};

function MyMarkerWithCircle({
  circleOptions,
  coordinates,
  lastMarker,
  noCurrentPosition,
  labelText,
  targetLastKnownCoords,
  lat,
  lng,
  showSignalLevels,
  setShowSignalLevels,
  beaconName,
}) {
  const { positionTrigger, networkSignalLevel, emergencyPositionType } = coordinates;
  const { messageId, positionType } = coordinates?.locationData || {};
  const markerRef = useRef(null);
  let isEmergency = false;
  switch (positionTrigger) {
    case null:
    case '0':
    case '1':
    case '18':
    case '256':
    case '999':
      break;
    default:
      isEmergency = true;
      break;
  }
  const markerIconType = beaconName
    ? 'beacon'
    : isEmergency
    ? 'emergency'
    : IS_CELL_LOCATION?.[messageId]?.[positionType]
    ? 'cell'
    : lastMarker
    ? 'last'
    : 'default';

  const markerIconStyle =
    markerIconType === 'emergency'
      ? emergencyPositionType
      : isEmergency && beaconName
      ? 'red'
      : beaconName
      ? 'green'
      : 'default';

  const MarkerIcon = getIcon({
    lastMarker,
    icon: markerIconType,
    type: markerIconStyle,
    positionTrigger,
    showSignalLevels,
    networkSignalLevel,
  });

  if (
    targetLastKnownCoords &&
    coordinates.date === targetLastKnownCoords.locationData.date * 1000 &&
    noCurrentPosition
  ) {
    circleOptions.fillColor = 'rgba(255, 255, 255, 0.8)';
  }
  const SOS_CALL_STARTED = '9';
  const EMERGENCY_TRACKING_TRIGGER = '256';

  const sosRedImage = require('assets/svg/red.png');
  const sosOrangeImage = require('assets/svg/orange.png');
  const sosLightBlue = require('assets/svg/lightblue.png');
  const sosImage =
    positionTrigger === SOS_CALL_STARTED
      ? sosRedImage
      : positionTrigger === EMERGENCY_TRACKING_TRIGGER
      ? sosOrangeImage
      : sosLightBlue;

  return (
    <>
      <Marker
        coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }}
        ref={markerRef}
        tracksViewChanges={false}
        zIndex={11}
        draggable
      >
        <View
          style={{
            alignItems: 'center',
            marginBottom: Platform.OS === 'ios' ? 30 : 0,
          }}
        >
          {positionTrigger && <MarkerIcon.Icon width={30} height={30} />}
          <Text
            style={{
              position: 'absolute',
              color: 'black',
              textAlign: 'center',
              fontSize: 10,
              marginTop: 6,
            }}
          >
            {labelText}
          </Text>
        </View>
        <MarkerInfo
          coordinates={coordinates}
          labelText={labelText}
          lat={lat}
          lng={lng}
          setShowSignalLevels={setShowSignalLevels}
          showSignalLevels={showSignalLevels}
          sosImage={sosImage}
          beaconName={beaconName}
          lastMarker={lastMarker}
          iconType={markerIconType}
          iconStyle={markerIconStyle}
        />
      </Marker>
    </>
  );
}

export default MyMarkerWithCircle;
