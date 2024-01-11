import Map from "./Map";
import EventList from "./EventList";
import { StyleSheet, Platform, StatusBar, SafeAreaView } from "react-native"; // Added import statements
import { Button, Layout } from "@ui-kitten/components";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";

function Home() {
  const [order, setOrder] = useState("asc");
  const [option, setOption] = useState("playingTime");
  const [eventsList, setEventsList] = useState([]);
  const [showEventsList, setShowEventsList] = useState(false);

  const fetchEventList = async () => {
    const eventsRef = collection(db, "events");
    const listQuery = query(eventsRef, orderBy(option, order));
    const eventsSnapshot = await getDocs(listQuery);
    const eventsArray = [];
    eventsSnapshot.forEach((list) => {
      const data = list.data();
      data.id = list.id;
      eventsArray.push(data);
    });
    setEventsList(eventsArray);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      if (isActive) {
        fetchEventList();
      }

      return () => {
        isActive = false;
      };
    }, [option, order])
  );

  if (showEventsList) {
    return (
      <Layout style={{ flex: 1 }}>
        <SafeAreaView style={showEventsList && styles.container}>
          <EventList eventsList={eventsList} setOption={setOption} setOrder={setOrder} />
          <Button
            style={styles.showHide}
            onPress={() => {
              setShowEventsList(!showEventsList);
            }}
          >
            {showEventsList ? "Map" : "List"}
          </Button>
        </SafeAreaView>
      </Layout>
    );
  } else {
    return (
      <>
        <Map eventsList={eventsList} />
        <Button
          style={styles.showHide}
          onPress={() => {
            setShowEventsList(!showEventsList);
          }}
        >
          {showEventsList ? "Map" : "List"}
        </Button>
      </>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
  },
  showHide: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
});
