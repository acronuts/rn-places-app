import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

import colors from "../constants/colors";

const ImageSelector = (props) => {
  const [selectedImage, setSelectedImage] = useState();

  const verifyPermissions = async () => {
    const result = await Camera.requestPermissionsAsync();
    if (result.status !== "granted") {
      Alert.alert("Permission not granted", "Please allow camera access", [
        { text: "OK" },
      ]);
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    // console.log('image0', image)
    setSelectedImage(image.uri);
    props.onImageTaken(image.uri)
  };

//   console.log(selectedImage)

  return (
    <View style={styles.imageSelector}>
      <View style={styles.imagePreview}>
        {!selectedImage ? (
          <Text>No Image selected</Text>
        ) : (
          <Image style={styles.image} source={{ uri: selectedImage }} />
        )}
      </View>
      <Button
        title="Take image"
        color={colors.primary}
        onPress={takeImageHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageSelector: {
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
      width: '100%',
      height: '100%'
  },
});

export default ImageSelector;
