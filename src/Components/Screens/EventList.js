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
  const [optionIndex, setOptionIndex] = useState(0);
  const [orderIndex, setOrderIndex] = useState(0);
  const [order, setOrder] = useState("asc");
  const [option, setOption] = useState("playingTime");
  const [eventsList, setEventsList] = useState([]);

  const fetchEventList = async () => {
    console.log("option", option, "order", order);
    const eventsRef = collection(db, "events");
    const listQuery = query(eventsRef, orderBy(option, order));
    const eventsSnapshot = await getDocs(listQuery);
    const eventsArray = [];
    eventsSnapshot.forEach((list) => {
      const data = list.data();
      eventsArray.push(data);
    });
    setEventsList(eventsArray);
  };

  useEffect(() => {
    fetchEventList();
  }, [option, order]);

  const handleOption = (index) => {
    let selectedOption;
    if (index.row === 0) {
      selectedOption = "minPlayers";
      setOptionIndex("Min Players");
    } else if (index.row === 1) {
      selectedOption = "maxPlayers";
      setOptionIndex("Max Players");
    } else {
      selectedOption = "playingTime";
      setOptionIndex("Playing Time");
    }

    setOption(selectedOption);
  };

  const handleOrder = (index) => {
    let selectedOrder;
    if (index.row === 1) {
      selectedOrder = "desc";
      setOrderIndex("Desc");
    } else {
      selectedOrder = "asc";
      setOrderIndex("Asc");
    }
    setOrder(selectedOrder);
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
          value={optionIndex}
          onSelect={handleOption}
          placeholder="Options"
          style={styles.selectItem}
        >
          <SelectItem title="Min Players" />
          <SelectItem title="Max Players" />
          <SelectItem title="Playing Time" />
        </Select>
        <Select
          value={orderIndex}
          onSelect={handleOrder}
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
