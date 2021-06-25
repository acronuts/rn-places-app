import * as FileSystem from "expo-file-system";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

import { fetchPlaces, insertPlace } from "../helpers/db";
import ENV from "../env";

export const addPlace = (title, image, location) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&apiKey=${ENV.geoapifyApiKey}`
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const resData = await response.json();
    if (!resData.features) {
      throw new Error("Something went wrong");
    }
    // console.log('resData', resData)
    const address = resData.features[0].properties.formatted;
    console.log(address);

    const fileName = image.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath,
      });
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      // console.log("db", dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng,
          },
        },
      });
    } catch (err) {
      console.log("error", err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchPlaces();
      // console.log("db from fetch", dbResult);
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};
