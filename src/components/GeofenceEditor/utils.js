/* eslint-disable no-plusplus */

import { MAX_RADIUS, MIN_RADIUS } from './constants';

const deg2rad = deg => deg * (Math.PI / 180);

const sqr = x => x * x;

const dist2 = (v, w) => sqr(v.lat - w.lat) + sqr(v.lng - w.lng);

const minus = (v2, v1) => ({ lat: v2.lat - v1.lat, lng: v2.lng - v1.lng });

const normal = v => ({ lat: -v.lng, lng: v.lat });

const dotProduct = (u, v) => u.lat * v.lat + u.lng * v.lng;

const normalized = v => {
  const l2 = Math.sqrt(dist2(v, { lat: 0, lng: 0 }));
  return l2 === 0 ? v : { lat: v.lat / l2, lng: v.lng / l2 };
};

const distToSegment = (p, v, w) => {
  const segmentLength2 = dist2(v, w);
  if (segmentLength2 === 0) {
    return dist2(p, v);
  }

  const projection = dotProduct(minus(w, v), minus(p, v)) / segmentLength2;
  const dist = dist2(p, {
    lat: v.lat + projection * (w.lat - v.lat),
    lng: v.lng + projection * (w.lng - v.lng),
  });

  const outOfSegment = projection < 0 || projection > 1;
  const dot1 = dotProduct(normalized(minus(p, v)), normal(normalized(minus(v, w))));
  const dot2 = dotProduct(normalized(minus(p, w)), normal(normalized(minus(v, w))));
  const dot = Math.min(dot1, dot2);
  return {
    dot,
    dist: outOfSegment ? null : dist,
  };
};

export const closestLineSegment = (coordinates, p) => {
  let closest = -1;
  let record = Infinity;
  let closestDot = -1;
  let recordDot = -Infinity;

  coordinates.forEach((v1, i) => {
    const v2 = coordinates[i + 1] || coordinates[0];
    const { dist, dot } = distToSegment(p, v1, v2);
    if (dot < 0) {
      return;
    }
    if (dist === null) {
      if (dot >= 0) {
        if (dot > recordDot) {
          recordDot = dot;
          closestDot = (i + 1) % coordinates.length;
        }
      }
    } else if (dist < record) {
      record = dist;
      closest = (i + 1) % coordinates.length;
    }
  });

  return closest > -1 ? closest : closestDot;
};

const isInsidePolygon = (polygon, point) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (
      polygon[i].lat > point.lat !== polygon[j].lat > point.lat &&
      point.lng <
        ((polygon[j].lng - polygon[i].lng) * (point.lat - polygon[i].lat)) /
          (polygon[j].lat - polygon[i].lat) +
          polygon[i].lng
    ) {
      inside = !inside;
    }
  }
  return inside;
};

export const getContainingPolygon = (polygons, point) => {
  let polygon;
  polygons.forEach(p => {
    if (isInsidePolygon(p.coordinates, point)) {
      polygon = p;
    }
  });
  return polygon;
};

export function getLatLngDistance(x, y) {
  const R = 6371;
  const dLat = deg2rad(y.lat - x.lat);
  const dLon = deg2rad(y.lng - x.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(x.lat)) * Math.cos(deg2rad(y.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1000;
}

export const getInitialPolygon = (coordinate, region) => {
  let { longitude: lng, latitude: lat, latitudeDelta, longitudeDelta } = region;

  const distance = getLatLngDistance({ lat, lng }, { lat, lng: lng + longitudeDelta * 0.2 });
  if (distance < MIN_RADIUS) {
    latitudeDelta *= MIN_RADIUS / distance;
    longitudeDelta *= MIN_RADIUS / distance;
  }

  return [
    { lat: coordinate.lat - latitudeDelta * 0.2, lng: coordinate.lng - longitudeDelta * 0.2 },
    { lat: coordinate.lat + latitudeDelta * 0.2, lng: coordinate.lng - longitudeDelta * 0.2 },
    { lat: coordinate.lat + latitudeDelta * 0.2, lng: coordinate.lng + longitudeDelta * 0.2 },
    { lat: coordinate.lat - latitudeDelta * 0.2, lng: coordinate.lng + longitudeDelta * 0.2 },
  ];
};

export const getDefaultRadius = region => {
  const { latitude: lat, longitude: lng, longitudeDelta } = region;
  const radius = getLatLngDistance({ lat, lng }, { lat, lng: lng + longitudeDelta * 0.2 });
  return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, Math.round(radius)));
};

export const getContainingCircle = (circles, point) => {
  let circle;
  circles.forEach(c => {
    if (sqr(getLatLngDistance(c.coordinates[0], point)) <= sqr(c.radius)) {
      circle = c;
    }
  });
  return circle;
};

export const coordinateAverage = coordinates => {
  if (coordinates?.length) {
    const n = coordinates.length;
    const empty = { lat: 0, lng: 0 };
    const { lat, lng } = coordinates.reduce(
      (acc, curr) => ({ lat: acc.lat + curr.lat, lng: acc.lng + curr.lng }),
      empty
    );
    return { latitude: lat / n, longitude: lng / n };
  }
};

const geofenceBounds = ({ coordinates, radius, type }) => {
  if (type === 'circle') {
    const latitudeDelta = ((2 * radius) / 1000 / 6371 / Math.PI) * 180;
    const longitudeDelta = latitudeDelta / Math.cos(deg2rad(latitudeDelta));
    return { longitudeDelta, latitudeDelta };
  }

  if (type === 'polygon') {
    const lats = coordinates.map(c => c.lat);
    const longs = coordinates.map(c => c.lng);
    const latitudeDelta = Math.max(...lats) - Math.min(...lats);
    const longitudeDelta = Math.max(...longs) - Math.min(...longs);
    return { latitudeDelta, longitudeDelta };
  }

  throw new Error(`Invalid geofence type ${type}`);
};

export const geofenceViewport = geofence => {
  const { coordinates } = geofence;
  const { latitude, longitude } = coordinateAverage(coordinates);
  let { latitudeDelta, longitudeDelta } = geofenceBounds(geofence);
  latitudeDelta *= 2;
  longitudeDelta *= 2;
  return { latitude, longitude, latitudeDelta, longitudeDelta };
};

export const getViewCoordinate = coord => ({ latitude: coord?.lat, longitude: coord?.lng });
export const getViewCoordinates = polygon => polygon.coordinates.map(getViewCoordinate);
export const getOriginalCoordinate = coord => ({ lat: coord?.latitude, lng: coord?.longitude });
