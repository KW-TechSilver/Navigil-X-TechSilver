import homebeaconOpenIconGreen from 'assets/svg/homebeaconOpenGreen.svg';
import homebeaconOpenIconRed from 'assets/svg/homebeaconOpenRed.svg';
import homebeaconOpenIconYellow from 'assets/svg/homebeaconOpenYellow.svg';
import homebeaconIconTeal from 'assets/svg/homebeaconTeal.svg';
import locMarkerRed from 'assets/map-icons/location_marker_red.png';
import locMarkerOrangeSmall from 'assets/map-icons/location_marker_orange_small.png';
import locMarkerWhite from 'assets/map-icons/location_marker_white.png';
import locMarkerGreenSmall from 'assets/map-icons/location_marker_green_small.png';
import locMarkerBlueSmall from 'assets/map-icons/location_marker_blue_small.png';
import signalStrengthGreen from 'assets/svg/signalStrengthGreen.svg';
import signalStrengthYellow from 'assets/svg/signalStrengthYellow.svg';
import signalStrengthRed from 'assets/svg/signalStrengthRed.svg';
import signalStrengthWhite from 'assets/svg/signalStrengthWhite.svg';
import locationMarkerDefault from 'assets/svg/locationMarkerDefault.svg';
import locationMarkerCell from 'assets/svg/locationMarkerCell.svg';
import locationMarkerLast from 'assets/svg/locationMarkerLast.svg';

import emergencyTrackingMarker from 'assets/svg/emergencyTrackingMarker.svg';
import sosCallMarker from 'assets/svg/sosCallMarker.svg';
import emergencyMarker from 'assets/svg/emergencyMarker.svg';
import { getSignalLevelColor } from '../Utils/Utils';

const ICON_SIZE = 30;
const EMERG_ICON_SIZE = 40;

export const MAP_TYPES = ['roadmap', 'terrain', 'satellite', 'hybrid'];

export const mapStyles = [
  {
    featureType: 'water',
    stylers: [{ saturation: 43 }, { lightness: -11 }, { hue: '#0088ff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ saturation: -100 }, { lightness: 99 }, { hue: '#ff0000' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#808080' }, { lightness: 54 }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ece2d9' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ccdca1' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#767676' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }],
  },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [{ visibility: 'on' }, { color: '#b8cb93' }],
  },
  { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
  {
    featureType: 'poi.sports_complex',
    stylers: [{ visibility: 'on' }],
  },
  { featureType: 'poi.medical', stylers: [{ visibility: 'on' }] },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'simplified' }],
  },
];

export const target = {
  coords: [],
  geofences: {},
  circleOptions: {
    strokeColor: '#FF0000',
    strokeOpacity: 0.4,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.25,
  },
  icon: {
    default: {
      url: locMarkerOrangeSmall, // url
    },
    beacon: {
      default: homebeaconIconTeal,
      green: homebeaconOpenIconGreen,
      yellow: homebeaconOpenIconRed,
      red: homebeaconOpenIconYellow,
    },
    cell: {
      url: locMarkerWhite, // url
    },
    last: {
      url: locMarkerRed, // url
    },
    signalStrength: {
      green: signalStrengthGreen,
      yellow: signalStrengthYellow,
      red: signalStrengthRed,
      unknown: signalStrengthWhite,
    },
  },
  id: '123456789',
  name: {
    firstName: 'Homer',
    lastName: 'Simpson',
  },
  polylineOptions: {
    strokeColor: '#D10000',
    strokeOpacity: 0.6,
    strokeWeight: 2,
    icons: [
      {
        icon: {
          path: 'M 0,0 2,4 M 0,0 -2,4',
          scale: 2,
          strokeColor: 'red',
          strokeWeight: 3,
        },
        offset: '100%',
        repeat: '150px',
      },
    ],
  },
};

export const helperCommonSettings = {
  circleOptions: {
    strokeColor: '#1cc600',
    strokeOpacity: 0.4,
    strokeWeight: 2,
    fillColor: '#1cc600',
    fillOpacity: 0.25,
  },
  polylineOptions: {
    strokeColor: '#2181ff',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    icons: [
      {
        icon: {
          path: 'M 0,0 2,4 M 0,0 -2,4',
          scale: 2,
          strokeColor: '#578aba',
          strokeWeight: 3,
        },
        offset: '100%',
        repeat: '150px',
      },
    ],
  },
  icon: {
    default: {
      url: locMarkerGreenSmall, // url
    },
    last: {
      url: locMarkerBlueSmall, // url
    },
  },
};

export const signalLostTimeLimit = 12 * 60 * 1000;

const markerParams = {
  signalStrength: {
    anchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    scaledSize: [ICON_SIZE, ICON_SIZE],
    labelOrigin: [ICON_SIZE / 2, ICON_SIZE / 2],
  },
  beacon: {
    anchor: [ICON_SIZE / 2, ICON_SIZE],
    scaledSize: [ICON_SIZE, ICON_SIZE],
  },
  emergency: {
    anchor: [EMERG_ICON_SIZE / 2, EMERG_ICON_SIZE / 2],
    scaledSize: [EMERG_ICON_SIZE, EMERG_ICON_SIZE],
    labelOrigin: [EMERG_ICON_SIZE / 2, EMERG_ICON_SIZE / 1.6],
  },
  default: {
    anchor: [ICON_SIZE / 2, ICON_SIZE],
    scaledSize: [ICON_SIZE, ICON_SIZE],
  },
  last: {
    anchor: [(1.5 * ICON_SIZE) / 2, 1.5 * ICON_SIZE],
    scaledSize: [1.5 * ICON_SIZE, 1.5 * ICON_SIZE],
  },
  cell: {
    anchor: [(1.5 * ICON_SIZE) / 2, 1.5 * ICON_SIZE],
    scaledSize: [1.5 * ICON_SIZE, 1.5 * ICON_SIZE],
  },
};

export const icons = {
  default: {
    default: locationMarkerDefault,
  },
  beacon: {
    default: homebeaconIconTeal,
    green: homebeaconOpenIconGreen,
    yellow: homebeaconOpenIconYellow,
    red: homebeaconOpenIconRed,
  },
  cell: {
    default: locationMarkerCell,
  },
  last: {
    default: locationMarkerLast,
  },
  signalStrength: {
    green: signalStrengthGreen,
    yellow: signalStrengthYellow,
    red: signalStrengthRed,
    unknown: signalStrengthWhite,
  },
};

const SOS_CALL_STARTED = '9';
const EMERGENCY_TRACKING = '257';

const getEmergencyIcon = ({ positionTrigger }) => {
  let Icon;
  switch (`${positionTrigger}`) {
    case SOS_CALL_STARTED:
      Icon = sosCallMarker;
      break;
    case EMERGENCY_TRACKING:
      Icon = emergencyTrackingMarker;
      break;
    default:
      Icon = emergencyMarker;
      break;
  }
  return { Icon };
};

export const getIcon = ({
  positionTrigger,
  icon: _icon = 'default',
  type: _type,
  showSignalLevels,
  networkSignalLevel,
}) => {
  const icon = showSignalLevels ? 'signalStrength' : _icon;
  const type = showSignalLevels ? getSignalLevelColor(networkSignalLevel) : _type;
  if (icon === 'emergency') {
    return getEmergencyIcon({ positionTrigger });
  }
  const iconParams = { ...markerParams[icon] } || {};
  Object.entries(iconParams).forEach(([name, value]) => {
    iconParams[name] = value;
  });
  iconParams.Icon = icons[icon][type];
  return iconParams;
};
