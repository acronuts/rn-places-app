import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import ImageSelector from "../components/ImageSelector";
import LocationSelect from "../components/LocationSelector";

import colors from "../constants/colors";
import * as placesActions from "../store/places-actions";

const NewPlaceScreen = (props) => {
  const [titleValue, setTitleValue] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [selectLocation, setSelectLocation] = useState()

  const dispatch = useDispatch();

  const titleChangeHandler = (text) => {
    setTitleValue(text);
  };

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const locationPickedHandler = useCallback((location) => {
    setSelectLocation(location);
  }, []);

  const savePlaceHandler = () => {
    dispatch(placesActions.addPlace(titleValue, selectedImage, selectLocation));
    props.navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <ImageSelector onImageTaken={imageTakenHandler} />
        <LocationSelect
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />
        <Button
          title="Save Place"
          color={colors.primary}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: "Add Place",
};

const styles = StyleSheet.create({
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
  },
  textInput: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
});

export default NewPlaceScreen;
