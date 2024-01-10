import React, { useRef, useState, useEffect, useContext } from "react";
import { StatusBar, StyleSheet, Platform, Image } from "react-native";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { UserContext } from "../Context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import * as Device from 'expo-device';
const customMapStyle = require('../../../assets/DarkMaps.json');
import { Button } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

function Map() {
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { location, setLocation, globalEvents } = useContext(UserContext);
  
  const navigation = useNavigation();
  
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('This will not work on an Android emulator. Try it on your device.');
        setLoading(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    })();
    setLoading(false);
  }, []);

  if (loading) return (
    <Layout style={styles.container}>
      <Spinner size='giant' />
    </Layout>
  );

  if (errorMsg) return (
    <Layout style={styles.container}>
      <Text>{errorMsg}</Text>
    </Layout>
  );

  const formatDate = (epoch) => {
    return new Date(epoch).toLocaleString();
  };



  return (

    <SafeAreaView style={styles.safeView}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(region) => setRegion(region)}
        showsUserLocation={true}
        showsMyLocationButton={true}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
      >
        {globalEvents && globalEvents.map((eventMarker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: eventMarker.location.latitude,
              longitude: eventMarker.location.longitude,
            }}
          >
            <Callout tooltip onPress={() => console.log('Go to EventDetails or something')}>
              <Layout style={styles.calloutView} level="4">
                <Text style={styles.eventName}>{eventMarker.eventName}</Text>
                <Text style={styles.gameName}>Game: {eventMarker.gameName}</Text>
                <Text>
                  <Image
                    style={styles.image}
                    source={{ uri: eventMarker.imageUrl }}
                    onError={(e) => console.log(e.nativeEvent.error)}
                    resizeMode="contain"
                  />
                </Text>
                <Text style={styles.details}>Date: {formatDate(eventMarker.dateTime)}</Text>
                <Text style={styles.details}>Players: {eventMarker.minPlayers} - {eventMarker.maxPlayers}</Text>
                <Text style={styles.details}>Organizer: {eventMarker.organiserUsername}</Text>
                <Text style={styles.details}>Duration: {eventMarker.playingTime} mins</Text>
              </Layout>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <StatusBar backgroundColor='#06D6A0' barStyle={'dark-content'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calloutView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    elevation: 10,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  gameName: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
  image: {
    width: 125,
    height: 125,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    fontSize: 12,
  }
});

export default Map;
