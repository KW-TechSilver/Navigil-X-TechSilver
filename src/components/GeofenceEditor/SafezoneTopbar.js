import React, { useState, useContext } from 'react';
import useFormatMessage from 'hooks/useFormatMessage';
import useIntlContext from 'hooks/useIntlContext';
import useSpinner from 'hooks/useSpinner';
import { MaterialIcons } from 'react-native-vector-icons';
import { TextInput, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { getAddressGoogle } from 'api/MiddlewareAPI';
import { actionColor } from 'core/theme';

import Context from './context';

const styles = StyleSheet.create({
  container: {
    height: 50,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  showSafezone: {
    width: '98%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
  },
  geofenceName: {
    width: '68%',
  },
  defaultView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  hideListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: 50,
    paddingRight: 5,
  },
  content: {
    color: actionColor,
    fontSize: 18,
  },
});

const NameInput = ({ selected: { geofenceAreaName }, setName, setEditing }) => (
  <TextInput
    onChangeText={setName}
    value={geofenceAreaName}
    autoFocus
    blurOnSubmit
    onSubmitEditing={() => setEditing(false)}
  />
);

const ShowSafezone = ({ selected, ucFirst }) => {
  const { deleteGeofence, editGeofence } = useContext(Context);
  const [editing, setEditing] = useState(false);
  const setName = geofenceAreaName => editGeofence({ ...selected, geofenceAreaName });

  return (
    <View style={styles.showSafezone}>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteGeofence(selected)}>
        <Text style={{ color: 'white' }}>{ucFirst({ id: 'general.delete' })}</Text>
      </TouchableOpacity>

      <View style={styles.geofenceName}>
        {editing ? (
          <NameInput selected={selected} setName={setName} setEditing={setEditing} />
        ) : (
          <TouchableOpacity onPress={() => setEditing(_value => !_value)}>
            <Text>{selected.geofenceAreaName}</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => setEditing(_value => !_value)}>
        <MaterialIcons name='edit' size={28} color={editing ? 'white' : '#000'} />
      </TouchableOpacity>
    </View>
  );
};

const DefaultView = () => {
  const { ucFirst } = useFormatMessage();
  const { showList, setShowList } = useContext(Context);

  return (
    <View style={styles.defaultView}>
      {showList ? (
        <TouchableOpacity onPress={() => setShowList(_value => !_value)}>
          <View style={styles.hideListButton}>
            <Text style={styles.content}>{ucFirst({ id: `general.hide` }).toUpperCase()}</Text>
            <MaterialIcons name='list' size={35} color={actionColor} />
          </View>
        </TouchableOpacity>
      ) : (
        <Text>{ucFirst({ id: 'geofenceEditor.pressOnSafezone' })}</Text>
      )}
    </View>
  );
};

const SearchBar = () => {
  const { locale } = useIntlContext();
  const { withSpinner } = useSpinner();
  const { ucFirst } = useFormatMessage();
  const { setCenter, setIsSearchMode, setId } = useContext(Context);

  const [search, setSearch] = useState('');

  const searchAddress = async () => {
    const address = search.trim();
    const language = locale.substr(0, 2);
    const res = await withSpinner(() => getAddressGoogle({ address, language }));
    const { geometry } = res.results?.[0] ?? {};

    if (geometry?.location) {
      const { location, viewport } = geometry;
      setCenter({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: viewport.northeast.lat - viewport.southwest.lat,
        longitudeDelta: viewport.northeast.lng - viewport.southwest.lng,
      });
      setId();
    }
    setIsSearchMode(false);
  };

  return (
    <>
      <MaterialIcons name='search' size={28} color='#aaa' />
      <TextInput
        style={{ width: '85%', height: 50, paddingLeft: 10 }}
        onChangeText={setSearch}
        value={search}
        autoFocus
        blurOnSubmit
        placeholder={`${ucFirst({ id: 'general.search' })}...`}
        onSubmitEditing={searchAddress}
      />
      <TouchableOpacity onPress={() => setIsSearchMode(false)}>
        <MaterialIcons name='close' size={28} color='#000' />
      </TouchableOpacity>
    </>
  );
};

const SafezoneDescription = () => {
  const { ucFirst } = useFormatMessage();

  return (
    <Context.Consumer>
      {({ selected, isCreateMode, isSearchMode, showList }) => (
        <View style={styles.container}>
          {isSearchMode ? (
            <SearchBar />
          ) : selected && !showList ? (
            <ShowSafezone selected={selected} ucFirst={ucFirst} />
          ) : isCreateMode ? (
            <Text>{ucFirst({ id: 'geofenceEditor.pressOnMap' })}</Text>
          ) : (
            <DefaultView />
          )}
        </View>
      )}
    </Context.Consumer>
  );
};

export default SafezoneDescription;
