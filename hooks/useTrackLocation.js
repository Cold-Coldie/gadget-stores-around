import { useContext, useState } from "react";
import { ACTION_TYPES, MainContext } from "../context/MainProvider";

const useTrackLocation = () => {
  const { dispatch } = useContext(MainContext);

  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  // const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLong(`${latitude},${longitude}`);

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });

    setLocationErrorMessage("");
    setIsFindingLocation(false);
  };

  const error = () => {
    // setLatLong("");
    setLocationErrorMessage("Unable to retrieve your location. ");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMessage("Geolocation is not supported by your browser.");
    } else {
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      });
      setIsFindingLocation(true);
    }
  };

  return {
    handleTrackLocation,
    // latLong,
    locationErrorMessage,
    isFindingLocation,
  };
};

export default useTrackLocation;
