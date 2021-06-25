import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import colors from "../constants/colors";

const MapScreen = (props) => {
  const initialLocation = props.navigation.getParam('initialLocation')
  const readonly = props.navigation.getParam('readonly')

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);


  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 47.3924763,
    longitude: initialLocation ? initialLocation.lng : 8.5403538,
    latitudeDelta: 0.089,
    longitudeDelta: 0.0421,
  };

  const selectLocationHandler = (event) => {
    if (readonly) {
      return
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  const saveLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      return
    }
    props.navigation.navigate('NewPlace', {pickedLocation: selectedLocation})
  }, [selectedLocation])

  useEffect(() => {
    props.navigation.setParams({saveLocation: saveLocationHandler})
  }, [saveLocationHandler])

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={mapRegion}
      onPress={selectLocationHandler}>
      {markerCoordinates && (
        <Marker title="Selected Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = (navData) => {
  const saveFn = navData.navigation.getParam('saveLocation')
  const readonly = navData.navigation.getParam('readonly')
  if (readonly) {
    return {}
  }
  return {
    headerRight: () => (
      <TouchableOpacity style={styles.headerBtn} onPress={saveFn}>
        <Text style={styles.headerBtnText}>Save</Text>
      </TouchableOpacity>
    ),
  };
};


const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  headerBtn: {
    marginHorizontal: 20,
  },
  headerBtnText: {
    fontSize: 18,
    color: Platform.OS === 'android' ? 'white' : colors.primary,
  }
});

export default MapScreen;
