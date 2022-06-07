import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import useFormatMessage from 'hooks/useFormatMessage';
import PrimaryButton from 'shared/components/PrimaryButton';
import { actionColor } from 'core/theme';

import Context from './context';
import SelectShapeButtons from './SelectShapeButtons';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 5,
    width: '100%',
  },
  editButtonContainer: {
    position: 'absolute',
    top: 80,
    right: 5,
    width: '100%',
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 5,
    width: '100%',
  },
  button: {
    height: 50,
    borderRadius: 30,
    borderWidth: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  green: {
    backgroundColor: '#4caf50',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexButton: {
    width: '45%',
  },
  editButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  searchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  showListButton: {
    color: actionColor,
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: 0.5,
    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
  },
});

const Button = ({ children, onPress, style }) => (
  <PrimaryButton onPress={onPress} style={[styles.button, styles.shadow, style]}>
    <View style={styles.flexRow}>{children}</View>
  </PrimaryButton>
);

const TextButton = ({ children, onPress, style }) => (
  <Button onPress={onPress} style={style}>
    <Text style={[styles.buttonText, style]}>{children}</Text>
  </Button>
);

const WithShowListButton = ({ children }) => {
  const { ucFirst } = useFormatMessage();
  const { setShowList } = useContext(Context);
  return (
    <View style={styles.flexRow}>
      <View style={styles.flexButton}>{children}</View>
      <View style={styles.flexButton}>
        <TextButton style={styles.showListButton} onPress={() => setShowList(true)}>
          {ucFirst({ id: 'general.showList' })}
        </TextButton>
      </View>
    </View>
  );
};

const AddShowListButtons = () => {
  const { ucFirst } = useFormatMessage();
  const { setIsCreateMode } = useContext(Context);

  return (
    <WithShowListButton>
      <TextButton onPress={() => setIsCreateMode(true)}>
        {ucFirst({ id: 'general.add' })}
      </TextButton>
    </WithShowListButton>
  );
};

const SearchButton = () => {
  const { isSearchMode, isEditMode, setIsSearchMode } = useContext(Context);
  if (isSearchMode || isEditMode) {
    return null;
  }

  return (
    <View style={{ marginLeft: 'auto' }} pointerEvents='box-none'>
      <Button onPress={() => setIsSearchMode(true)} style={styles.searchButton}>
        <MaterialCommunityIcons name='map-search' size={30} color='#000' />
      </Button>
    </View>
  );
};

const EditButton = () => {
  const { isEditMode, setIsEditMode } = useContext(Context);
  const iconName = isEditMode ? 'check' : 'map-marker';
  return (
    <View style={{ marginLeft: 'auto' }} pointerEvents='box-none'>
      <Button
        onPress={() => setIsEditMode(_value => !_value)}
        style={[styles.editButton, isEditMode && styles.green]}
      >
        <MaterialCommunityIcons name={iconName} size={30} color='white' />
      </Button>
    </View>
  );
};

const OverlayButtons = () => {
  const context = useContext(Context);
  const { isEditMode, isCreateMode, selected, showList } = context;

  if (showList) {
    return null;
  }

  return (
    <>
      <View style={styles.container} pointerEvents='box-none'>
        <View style={styles.searchButtonContainer} pointerEvents='box-none'>
          <SearchButton />
        </View>

        <View style={styles.editButtonContainer} pointerEvents='box-none'>
          {selected?.type === 'polygon' && <EditButton />}
        </View>
      </View>

      <View style={styles.addButtonContainer} pointerEvents='box-none'>
        {!isEditMode && (isCreateMode ? <SelectShapeButtons /> : <AddShowListButtons />)}
      </View>
    </>
  );
};

export default OverlayButtons;
