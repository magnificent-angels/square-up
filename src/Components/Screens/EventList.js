import React, { useEffect, useState } from "react";
import { StyleSheet, Image, SafeAreaView } from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
import FocusAwareStatusBar from "../../utils/StatusBar";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../utils/dateFormat";

const EventList = () => {
  const [optionIndex, setOptionIndex] = useState(0);
  const [orderIndex, setOrderIndex] = useState(0);
  const [order, setOrder] = useState("asc");
  const [option, setOption] = useState("playingTime");
  const [eventsList, setEventsList] = useState([]);

  const navigation = useNavigation();

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
        style={styles.button}
        accessoryLeft={imageRender}
      >
        <Layout style={styles.listContainer}>
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
    <>
      <FocusAwareStatusBar />
      <SafeAreaView>
        <Layout style={styles.header}>
          <Text category="h1">Games Around Me</Text>
          <Text category="h5" style={styles.headerFilter}>
            Filter
          </Text>
        </Layout>

        <Layout style={styles.dropDown}>
          <Select
            value={optionIndex}
            onSelect={handleOption}
            placeholder="Options"
            style={styles.selectItem}
          >
            <SelectItem title="Min Players" style={styles.title} />
            <SelectItem title="Max Players" style={styles.title} />
            <SelectItem title="Playing Time" style={styles.title} />
          </Select>
          <Select
            value={orderIndex}
            onSelect={handleOrder}
            placeholder="Order"
            style={styles.selectItem}
            variant="giant"
          >
            <SelectItem title="Asc" style={styles.title} />
            <SelectItem title="Desc" style={styles.title} />
          </Select>
        </Layout>
        <Layout style={styles.listLayout}>
          <List
            data={eventsList}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
          />
        </Layout>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  headerFilter: {
    paddingTop: 30,
  },
  dropDown: {
    minHeight: 10,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 30,
  },
  selectItem: {
    minWidth: 180,
  },
  title: {
    textAlign: "center",
  },
  listLayout: {
    height: "74%",
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
