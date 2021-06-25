import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import MapPreview from "./MapPreview";

import colors from "../constants/colors";

const LocationSelector = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  const mapPickedLocation = props.navigation.getParam('pickedLocation')

  const {onLocationPicked} = props

  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation)
      onLocationPicked(mapPickedLocation)
    }
  }, [mapPickedLocation, onLocationPicked])

  const verifyPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Please allow location permission",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      // console.log(location);
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      props.onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      })
    } catch (err) {
      Alert.alert(
        "Could not get location",
        "Please try again later or pick location on map",
        [{ text: "Ok" }]
      );
    }
    setIsFetching(false);
  };

  const selectOnMapHandler = () => {
    props.navigation.navigate('Map')
  }

  return (
    <View style={styles.locationContainer}>
      <MapPreview style={styles.mapPreview} location={pickedLocation} onSelect={selectOnMapHandler}>
        {isFetching ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Text>No location chosen</Text>
        )}
      </MapPreview>
      <View style={styles.actionBtn}>
        <Button
          title="Get location"
          color={colors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title="Select on Map"
          color={colors.primary}
          onPress={selectOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    marginBottom: 15,
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  actionBtn: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%'
  }
});

export default LocationSelector;
