import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";
import MapView from "react-native-maps";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function Map() {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const Northcoders = {
    latitude: 53.47220328294084,
    longitude: -2.2382592504725047,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    zoom: 15,
  };
  const northcoders = () => {
    //complete this animation in 3 seconds
    mapRef.current.animateToRegion(Northcoders, 3 * 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 53.45407481615457,
          longitude: -2.215475996747256,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={(region) => setRegion(region)}
      />
      <Button onPress={() => northcoders()} title="Go to Northcoders" />
      <Text style={styles.text}>
        Current latitude{region.latitude.toFixed(4)}
      </Text>
      <Text style={styles.text}>
        Current longitude{region.longitude.toFixed(4)}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 15,
    backgroundColor: "lightblue",
  },
});

export default Map;
