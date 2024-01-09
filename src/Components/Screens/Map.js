import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { StyleSheet } from "react-native";
import { db } from "../../firebase";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { doc, getDoc } from "firebase/firestore";

function Map() {
  const mapRef = useRef(null);
  const { user, events, setEvents } = useContext(UserContext);

  const { latitude, longitude } = user;
  const [region, setRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });


  useEffect(() => {
    const docRef = doc(db, 'events', '11EIhyDjUJWu1HOcba7R');
    getDoc(docRef)
      .then((result) => {
      const data = result.data();
      setEvents(data)
      console.log(events.location.latitude);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      onRegionChangeComplete={(region) => setRegion(region)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});



export default Map;
