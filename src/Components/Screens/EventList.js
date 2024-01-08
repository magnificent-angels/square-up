import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Layout,
  Text,
  Select,
  SelectItem,
  List,
  Divider,
  Button,
} from "@ui-kitten/components";

const EventList = () => {
  const [optionIndex, setOptionIndex] = useState("");
  const [orderIndex, setOrderIndex] = useState("");
  const [eventsList, setEventsList] = useState([]);

  const fetchEventList = async () => {
    // if (optionIndex && orderIndex == 0)
    //  {
    // const eventsSnapshot = await getDocs(collection(db, "events"));
    // const eventsArray = [];
    // eventsSnapshot.forEach((list) => {
    //   const data = list.data();
    //   eventsArray.push(data);
    // });
    // setEventsList(eventsArray);
    // } else {
    const eventsRef = collection(db, "events");
    const query = query(eventsRef, orderBy(optionIndex, orderIndex));
    const eventsSnapshot = await getDocs(query);
    const eventsArray = [];
    eventsSnapshot.forEach((list) => {
      const data = list.data();
      eventsArray.push(data);
    });
    setEventsList(eventsArray);
  };

  useEffect(() => {
    fetchEventList();
  }, []);

  const handleOption = (selectIndex) => {
    console.log(`selected options ${index}`);
    let selectedOption;
    if (selectIndex === 1) {
      selectedOption = "minPlayers";
    } else if (selectIndex === 2) {
      selectedOption = "maxPlayers";
    } else {
      selectedOption = "playingTime";
    }
    setOptionIndex(selectedOption);
  };

  const handleOrder = (orderIndex) => {
    console.log(`selected oder ${index}`);
    let selectedOrder;
    if (orderIndex === 2) {
      selectedOrder = "desc";
    } else {
      selectedOrder = "asc";
    }
    setOrderIndex(selectedOrder);
  };

  const renderItem = ({ item, index }) => (
    <Button
      key={index}
      appearance="ghost"
      onPress={() => {
        console.log("selected an event");
        console.log(eventsList);
      }}
    >
      <Text>{item.gameName}</Text>
    </Button>
  );

  return (
    <SafeAreaView>
      <Layout style={styles.container}>
        <Text category="h1">Games Around Me</Text>
        <Text category="h5">Filter</Text>
      </Layout>

      <Layout style={styles.dropDown}>
        <Select
          selectedIndex={optionIndex}
          onSelect={handleOption}
          placeholder="Options"
          style={styles.selectItem}
        >
          <SelectItem title="Min Players" />
          <SelectItem title="Max Players" />
          <SelectItem title="Playing Time" />
        </Select>
        <Select
          selectedIndex={orderIndex}
          onOrder={handleOrder}
          placeholder="Order"
          style={styles.selectItem}
        >
          <SelectItem title="Asc" />
          <SelectItem title="Desc" />
        </Select>
      </Layout>
      <Layout>
        <List
          data={eventsList}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  dropDown: {
    minHeight: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  selectItem: {
    minWidth: 140,
  },
});

export default EventList;
