import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useDeviceId from 'hooks/useDeviceId';
import SelectDevice from 'components/SelectDevice';

import Context from './context';
import Map from './Map';

const modeFn = (state, x, mode) => {
  if (typeof x === 'function') {
    return modeFn(state, x(state), mode);
  }

  if (x) {
    return mode;
  }

  return state === mode ? null : state;
};

const GeofenceEditor = ({ geofences, setGeofences, state, initialized }) => {
  const deviceId = useDeviceId();
  const [id, setId] = useState();
  const [mode, setMode] = useState();
  const [showList, setShowList] = useState(false);

  const setIsEditMode = useCallback(x => setMode(_x => modeFn(_x, x, 'edit')), []);
  const setIsCreateMode = useCallback(x => setMode(_x => modeFn(_x, x, 'create')), []);
  const setIsSearchMode = useCallback(x => setMode(_x => modeFn(_x, x, 'search')), []);

  const isEditMode = useMemo(() => mode === 'edit', [mode]);
  const isCreateMode = useMemo(() => mode === 'create', [mode]);
  const isSearchMode = useMemo(() => mode === 'search', [mode]);

  const selected = useMemo(() => id && geofences.find(x => x.id === id), [id, geofences]);

  const addGeofence = useCallback(
    data => {
      setGeofences(_geofences => [..._geofences, data]);
      setId(data.id);
    },
    [setGeofences]
  );

  const deleteGeofence = useCallback(
    data => {
      setGeofences(_geofences => _geofences.filter(x => x.id !== data.id));
      setId();
    },
    [setGeofences]
  );

  const editGeofence = useCallback(
    data => {
      setGeofences(_geofences => [..._geofences.filter(x => x.id !== data.id), data]);
    },
    [setGeofences]
  );

  useEffect(() => {
    if (state !== 'dirty') {
      setId();
    }
  }, [state]);

  useEffect(() => {
    if (isSearchMode || isCreateMode) {
      setId();
    }
  }, [isSearchMode, isCreateMode]);

  useEffect(() => {
    if (showList) {
      setMode();
    }
  }, [showList]);

  useEffect(() => {
    if (!selected) {
      setIsEditMode(false);
    } else {
      setIsSearchMode(false);
    }
  }, [selected, setIsEditMode, setIsSearchMode]);

  if (!initialized || !deviceId) {
    return <SelectDevice />;
  }

  return (
    <Context.Provider
      value={{
        deleteGeofence,
        selected,
        setId,
        isSearchMode,
        setIsSearchMode,
        isCreateMode,
        setIsCreateMode,
        isEditMode,
        setIsEditMode,
        geofences,
        addGeofence,
        editGeofence,
        state,
        showList,
        setShowList,
      }}
    >
      <SelectDevice />
      <Map />
    </Context.Provider>
  );
};

export default GeofenceEditor;
