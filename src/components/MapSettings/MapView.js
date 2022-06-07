import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import useDevice from 'hooks/useDevice';
import { IconButton, Colors } from 'react-native-paper';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import SelectDevice from 'components/SelectDevice';
import { loadGeofences, fetchCoordinates } from 'actions';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { Entypo } from 'react-native-vector-icons';
import useFormatMessage from 'hooks/useFormatMessage';
import useEmergencyTracking from 'hooks/useEmergencyTracking';
import EmergencyTrackingOn from 'assets/svg/emergencyTrackingOn';
import EmergencyTrackingOff from 'assets/svg/emergencyTrackingOff';
import HelpIcon from 'shared/components/HelpIcon';
import TargetPath from 'rafaelComponents/MapTool/MapContainer/TargetPath/TargetPath';
import SelectHours from 'rafaelComponents/MapTool/MapContainer/MapControls/Toolbar/SelectHours.js';
import CalendarModal from 'screens/CalendarModal';
import AllHomeBeacons from 'rafaelComponents/MapTool/MapContainer/AllHomeBeacons/AllHomeBeacons';
import AllGeofences from 'rafaelComponents/MapTool/MapContainer/AllGeofences/AllGeofences';
import CurrentRange from './CurrentRange';

export const geofenceOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: '0.8',
  strokeWeight: '2',
  fillColor: '#FF0000',
  fillOpacity: '0.15',
};

const MAPS_HELP = '/maps';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(0, 120, 255)',
  },
  map: {
    flex: 1,
    zIndex: 11,
  },
  headline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  emergencyTracking: {
    marginRight: 10,
  },
});

const recenterMap = () => {};
const homebeaconsChange = () => {};
const MAP_TYPES = ['standard', 'satellite', 'hybrid'];

const MapExample = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [mapType, setMapType] = useState(0);
  const [location, setLocation] = useState(null);
  const [{ deviceId }] = useDevice();
  const [locationEnabled, setLocationEnabled] = useState(false);

  const [isEmergencyTracking, startTracking, stopTracking] = useEmergencyTracking();
  const [showSelectHours, setShowSelectHours] = useState(true);
  const {
    baseData: { 'default-location': defaultCenter },
    serialNumber,
    coordinates,
    filter,
    targetLastKnownCoords,
  } = useSelector(store => ({
    coordinates: store.coordinates,
    serialNumber: store.serialNumber,
    filter: store.filter,
    targetLastKnownCoords: store.targetLastKnownCoords,
    baseData: store.baseData,
  }));
  const [defaultMapCenter, setDefaultMapCenter] = useState(defaultCenter);

  const [region, setRegion] = useState({
    latitude: defaultMapCenter?.lat,
    longitude: defaultMapCenter?.lng,
    latitudeDelta: 0.05231825004849355,
    longitudeDelta: 0.07106782039633686,
  });
  const mapRef = useRef();

  useEffect(() => {
    if (serialNumber) {
      dispatch(loadGeofences(serialNumber));
      dispatch(fetchCoordinates(serialNumber));
    }
  }, [dispatch, serialNumber, filter]);
  useEffect(() => {
    setDefaultMapCenter(defaultCenter);
  }, [defaultCenter, serialNumber]);

  useEffect(() => {
    if (targetLastKnownCoords && !locationEnabled) {
      setRegion(tempData => ({
        ...tempData,
        latitude: targetLastKnownCoords?.locationData.lat,
        longitude: targetLastKnownCoords?.locationData.lng,
      }));
    } else {
      setRegion(tempData => ({
        ...tempData,
        latitude: defaultMapCenter?.lat,
        longitude: defaultMapCenter?.lng,
      }));
    }
  }, [targetLastKnownCoords, locationEnabled, serialNumber, defaultMapCenter]);
  useEffect(() => {
    if (location && locationEnabled) {
      setRegion(tempData => ({
        ...tempData,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    }
  }, [location, locationEnabled]);

  const enableSelectHours = useCallback(() => {
    setModalVisible(false);
    setShowSelectHours(true);
  }, []);

  const hideSelectHours = useCallback(() => {
    setModalVisible(true);
    setShowSelectHours(false);
  }, []);

  const handleMapType = () => {
    setMapType(count => count + 1);
    if (mapType >= 2) {
      setMapType(0);
    }
  };
  useEffect(() => {
    (async () => {
      if (locationEnabled) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation) {
          const _location = JSON.stringify(currentLocation);
          setLocation(JSON.parse(_location));
        }
      }
    })();
  }, [locationEnabled]);

  const enableEmergencyTracking = async () => {
    if (isEmergencyTracking) {
      await stopTracking();
    } else {
      await startTracking();
    }
  };
  const enableLocation = () => {
    setLocationEnabled(previousState => !previousState);
  };
  return (
    <>
      <SelectDevice />
      <View style={styles.headline}>
        <TouchableOpacity onPress={enableSelectHours} style={styles.timeButton}>
          <Entypo name='back-in-time' color={Colors.green500} size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={enableEmergencyTracking} style={styles.timeButton}>
          {isEmergencyTracking ? (
            <EmergencyTrackingOn height={30} width={30} />
          ) : (
            <EmergencyTrackingOff height={30} width={30} />
          )}
        </TouchableOpacity>

        <IconButton icon='calendar' color={Colors.blue500} size={22} onPress={hideSelectHours} />
        <Entypo
          name='layers'
          color={Colors.orange700}
          size={22}
          onPress={handleMapType}
          style={styles.timeButton}
        />
        <TouchableOpacity onPress={enableLocation} style={styles.timeButton}>
          {locationEnabled ? (
            <MaterialIcons name='location-on' size={24} color='black' />
          ) : (
            <MaterialIcons name='location-off' size={24} color='black' />
          )}
        </TouchableOpacity>
        <CurrentRange filter={filter} />
      </View>
      {showSelectHours && <SelectHours />}
      <CalendarModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        deviceId={deviceId}
        serialNumber={serialNumber}
      />
      <TouchableOpacity onPress={enableSelectHours} style={styles.emergencyTracking}>
        <EmergencyTrackingOn height={30} width={30} />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        zoomEnabled
        zoomControlEnabled
        toolbarEnabled={false}
        center={defaultCenter}
        scrollEnabled
        rotateEnabled
        zoomTapEnabled
        mapType={MAP_TYPES.find((type, index) => index === mapType && type)}
        zoom={2}
        showsMyLocationButton
        showsCompass
        showsUserLocation
        onMapReady={map => {
          mapRef.current = map;
        }}
      >
        <TargetPath
          coordsArray={coordinates}
          filter={filter}
          targetLastKnownCoords={targetLastKnownCoords}
        />
        <AllGeofences />
        <AllHomeBeacons cluster recenterMap={recenterMap} onChange={homebeaconsChange} />
      </MapView>
    </>
  );
};

const Stack = createStackNavigator();

const Container = () => {
  const { ucFirst } = useFormatMessage();
  const getHelp = useCallback(() => <HelpIcon url={MAPS_HELP} />, []);

  return (
    <Stack.Navigator initialRouteName='maps'>
      <Stack.Screen
        name='maps'
        component={MapExample}
        options={{ title: ucFirst({ id: 'general.maps' }), headerRight: getHelp }}
      />
    </Stack.Navigator>
  );
};

export default Container;
