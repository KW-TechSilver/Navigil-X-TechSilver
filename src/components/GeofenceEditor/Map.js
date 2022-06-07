import React, { useContext, useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useDeviceId from 'hooks/useDeviceId';
import MapView from 'react-native-maps';
import { moveRegion } from 'actions/geofenceEditor';

import Context from './context';
import SafezoneTopbar from './SafezoneTopbar';
import RadiusSlider from './RadiusSlider';
import OverlayButtons from './OverlayButtons';
import GeofenceList from './GeofenceList';
import Polygon from './Polygon';
import Circle from './Circle';
import { newPolygon, newCircle } from './creators';
import { DEFAULT_REGION, DEFAULT_OPTIONS, DEFAULT_SELECTED_OPTIONS } from './constants';
import {
  closestLineSegment,
  getContainingPolygon,
  getContainingCircle,
  getInitialPolygon,
  getDefaultRadius,
  coordinateAverage,
  getOriginalCoordinate,
} from './utils';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  editButtonOverlay: {
    position: 'absolute',
    top: 100,
    bottom: 0,
    width: '100%',
  },
  geofenceList: {
    top: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#fff',
  },
});

const getOptions = baseData => {
  const { geofenceColors = {} } = baseData?.['circle-colors'] ?? {};
  return {
    options: geofenceColors?.geofence ?? DEFAULT_OPTIONS,
    selectedOptions: geofenceColors?.geofenceInProgress ?? DEFAULT_SELECTED_OPTIONS,
  };
};

const getRegion = (geofences, baseData) => {
  const defaultLocation = baseData['default-location'];
  const geofenceCenter = coordinateAverage(geofences?.[geofences.length - 1]?.coordinates);
  return {
    ...DEFAULT_REGION,
    latitude: geofenceCenter?.latitude ?? defaultLocation?.lat,
    longitude: geofenceCenter?.longitude ?? defaultLocation?.lng,
  };
};

const splitByType = geofences => {
  const polygons = [];
  const circles = [];

  geofences.forEach(geofence => {
    if (geofence.type === 'polygon') {
      polygons.push(geofence);
    } else if (geofence.type === 'circle') {
      circles.push(geofence);
    } else {
      console.log(`Unknown geofence type ${geofence.type}`);
    }
  });

  return [polygons, circles];
};

const getKey = geofence => `${geofence.id}${geofence.coordinates.map(c => c.lat).join('')}`;
const renderPolygon = p => <Polygon key={getKey(p)} polygon={p} />;
const renderCircle = c => <Circle key={getKey(c)} circle={c} />;

const Map = () => {
  const context = useContext(Context);
  const {
    selected,
    isCreateMode,
    setIsCreateMode,
    isEditMode,
    setId,
    geofences,
    addGeofence,
    editGeofence,
    state,
    showList,
  } = context;

  const dispatch = useDispatch();
  const baseData = useSelector(store => store.baseData);

  const mapRef = useRef();
  const regionRef = useRef();

  const deviceId = useDeviceId();
  const [shape, setShape] = useState('polygon');
  const [polygons, circles] = useMemo(() => splitByType(geofences), [geofences]);
  const { selectedOptions, options } = useMemo(() => getOptions(baseData), [baseData]);
  const initialRegion = useMemo(() => getRegion(geofences, baseData), [deviceId, baseData]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCenter = useCallback(({ latitude, longitude, longitudeDelta, latitudeDelta }) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: latitude ?? regionRef.current.latitude,
          longitude: longitude ?? regionRef.current.longitude,
          longitudeDelta: longitudeDelta ?? regionRef.current.longitudeDelta,
          latitudeDelta: latitudeDelta ?? regionRef.current.latitudeDelta,
        },
        100
      );
    }
  }, []);

  const handleGeofencePress = useCallback(
    geofence =>
      state !== 'progress' &&
      !isEditMode &&
      (setId(geofence.id) || setCenter({ ...coordinateAverage(geofence.coordinates) })),
    [isEditMode, setId, state, setCenter]
  );

  const modifyGeofence = useCallback(
    coordinate => {
      const coordinates = [...selected.coordinates];
      const index = closestLineSegment(coordinates, coordinate);
      coordinates.splice(index, 0, coordinate);
      editGeofence({ ...selected, coordinates });
    },
    [selected, editGeofence]
  );

  const createGeofence = useCallback(
    coordinate => {
      const id = Math.max(...geofences.map(p => p.id), 0) + 1;

      switch (shape) {
        case 'polygon': {
          const coordinates = getInitialPolygon(coordinate, regionRef.current);
          return { ...newPolygon({ id }), deviceId, coordinates };
        }

        case 'circle': {
          const radius = getDefaultRadius(regionRef.current);
          const coordinates = [coordinate];
          return { ...newCircle({ id }), deviceId, coordinates, radius };
        }

        default:
          console.log(`Tried to create unknown shape ${shape}`);
      }
    },
    [shape, deviceId, geofences]
  );

  const handleMapPress = useCallback(
    e => {
      const coordinate = getOriginalCoordinate(e.nativeEvent.coordinate);

      if (isCreateMode) {
        const created = createGeofence(coordinate);
        addGeofence(created);
        setCenter({ ...regionRef.current, ...coordinateAverage(created.coordinates) });
        return setIsCreateMode(false);
      }

      const polygon = getContainingPolygon(polygons, coordinate);
      const circle = getContainingCircle(circles, coordinate);
      const geofence = polygon || circle;

      if (geofence && !isEditMode) {
        return handleGeofencePress(geofence);
      }

      if (isEditMode) {
        if (!selected?.id || selected?.id === geofence?.id) {
          return;
        }

        return modifyGeofence(coordinate);
      }

      return setId();
    },
    [
      addGeofence,
      circles,
      createGeofence,
      handleGeofencePress,
      isCreateMode,
      isEditMode,
      modifyGeofence,
      polygons,
      selected,
      setCenter,
      setId,
      setIsCreateMode,
    ]
  );

  return (
    <Context.Provider
      value={{
        ...context,
        shape,
        setShape,
        setCenter,
        options,
        selectedOptions,
        handleGeofencePress,
      }}
    >
      <SafezoneTopbar />
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          zoomEnabled
          toolbarEnabled={false}
          scrollEnabled
          rotateEnabled
          zoomTapEnabled
          showsCompass
          maxZoomLevel={15}
          moveOnMarkerPress={false}
          onRegionChangeComplete={_region => {
            regionRef.current = _region;
            dispatch(moveRegion(_region));
          }}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {polygons.map(renderPolygon)}
          {circles.map(renderCircle)}
        </MapView>

        {showList && (
          <View style={styles.geofenceList}>
            <GeofenceList />
          </View>
        )}
      </View>

      <View style={styles.editButtonOverlay} pointerEvents='box-none'>
        <RadiusSlider />
        <OverlayButtons />
      </View>
    </Context.Provider>
  );
};

export default React.memo(Map);
