import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Button } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

function Map() {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const nav = useNavigation();

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      />
      <Button
        style={styles.button}
        onPress={() => {
          nav.navigate("EventList");
        }}
      >
        List View
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default Map;
