import React, { useState, useEffect } from "react";
import { StyleSheet, Image, SafeAreaView } from "react-native";
import { Layout, Text, Select, SelectItem, List, Divider, Button } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../utils/dateFormat";

const EventList = ({ eventsList, setOrder, setOption }) => {
  const [optionIndex, setOptionIndex] = useState(0);
  const [orderIndex, setOrderIndex] = useState(0);
  const navigation = useNavigation();

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

  const renderItem = ({ item, index }) => {
    const imageRender = () => {
      return <Image source={{ uri: item.imageUrl }} style={styles.image} />;
    };
    return (
      <Button
        key={index}
        appearance="ghost"
        onPress={() => {
          navigation.navigate("EventDetails", { eventId: item.id });
        }}
        accessoryLeft={imageRender}
      >
        <Layout style={styles.listContainer} level="2">
          <Layout style={styles.textContainer}>
            <Text style={styles.titleText} category="h6">
              {item.eventName}
            </Text>
            <Text>Date: {formatDate(item.dateTime)}</Text>
            <Text>Game: {item.gameName}</Text>
            <Text>
              Players: {item.minPlayers} - {item.maxPlayers}
            </Text>
            <Text>Organiser: {item.organiserUsername}</Text>
            <Text>Duration: {item.playingTime} minutes</Text>
          </Layout>
        </Layout>
      </Button>
    );
  };

  return (
    <Layout style={StyleSheet.absoluteFill}>
      <Layout style={styles.header}>
        <Text category="h2">Games Around Me</Text>
        <Text category="h6" style={styles.headerFilter}>
          Filters
        </Text>
      </Layout>

      <Layout style={styles.dropDown}>
        <Select value={optionIndex} onSelect={handleOption} placeholder="Options" style={styles.selectItem}>
          <SelectItem title="Min Players" style={styles.title} />
          <SelectItem title="Max Players" style={styles.title} />
          <SelectItem title="Playing Time" style={styles.title} />
        </Select>
        <Select value={orderIndex} onSelect={handleOrder} placeholder="Order" style={styles.selectItem} variant="giant">
          <SelectItem title="Asc" style={styles.title} />
          <SelectItem title="Desc" style={styles.title} />
        </Select>
      </Layout>

      <List data={eventsList} renderItem={renderItem} ItemSeparatorComponent={Divider} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 10,
  },
  headerFilter: {
    paddingTop: 20,
    color: "#bbb",
  },
  dropDown: {
    minHeight: 10,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10,
  },
  selectItem: {
    minWidth: 180,
  },
  title: {
    textAlign: "center",
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    flex: 1,
    width: 220,
    margin: 20,
    padding: 10,
    backgroundColor: "transparent",
  },
  titleText: {
    fontWeight: "bold",
  },
  image: {
    height: 100,
    aspectRatio: 1,
    resizeMode: "contain",
  },
});

export default EventList;
