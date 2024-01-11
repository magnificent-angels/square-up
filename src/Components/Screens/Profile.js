import React, { useContext, useState } from "react";
import { StyleSheet, FlatList, ScrollView, StatusBar, TouchableOpacity, View } from "react-native";
import { Layout, Text, Avatar, Divider, Card, Spinner, Button } from "@ui-kitten/components";
import { UserContext } from "../Context/UserContext";
import SignOut from "./SignOut";
import { db } from "../../firebase";
import { getDoc, doc, query, collection, getDocs, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const Profile = () => {
  const { user, wishlist, setWishlist, owned, setOwned, events, setEvents } = useContext(UserContext);
  const { photoURL, displayName, uid } = user;
  const [loading, setLoading] = useState(true);
  const [myEventsList, setMyEventsList] = useState([]);
  const navigation = useNavigation();

  const fetchEventList = async () => {
    const q = query(collection(db, "events"), where("organiserUsername", "==", user.displayName));
    const eventsSnapshot = await getDocs(q);
    const eventsArray = [];
    eventsSnapshot.forEach((list) => {
      const data = list.data();
      data.id = list.id;
      eventsArray.push(data);
    });
    setMyEventsList(eventsArray);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      if (isActive) {
        const docRef = doc(db, "users", uid);
        getDoc(docRef).then((result) => {
          setLoading(false);
          const userData = result.data();
          setWishlist(userData.wishlist);
          setOwned(userData.owned);
          setEvents(userData.events);
          fetchEventList();
          console.log(myEventsList[0]);
        });
      }

      return () => {
        isActive = false;
      };
    }, [])
  );

  const renderGameItem = ({ item }) => (
    <Card style={styles.gameItemContainer} disabled>
      <Avatar source={{ uri: item.url }} style={styles.image} />
      <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
        {item.name}
      </Text>
    </Card>
  );

  const renderEventItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.gameItemContainer}
        onPress={() => {
          navigation.navigate("EventDetails", { eventId: item.eventID });
        }}
      >
        <Card style={styles.gameItemContainer} disabled>
          <Avatar source={{ uri: item.image }} style={styles.image} />

          <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
            {item.eventName}
          </Text>
          <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
            {item.gameName}
          </Text>
          <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
            {new Date(item.dateAndTime).toUTCString()}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderMyEventItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.gameItemContainer}
        onPress={() => {
          navigation.navigate("EventDetails", { eventId: item.id });
        }}
      >
        <Card style={styles.gameItemContainer} disabled>
          <Avatar source={{ uri: item.imageUrl }} style={styles.image} />

          <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
            {item.eventName}
          </Text>
          <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
            {item.gameName}
          </Text>
          <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
            {new Date(item.dateTime).toUTCString()}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.safeArea} level="4">
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Layout level="4">
          <SignOut />

          <Card style={styles.profileBox} disabled status="primary">
            <Avatar size="giant" source={{ uri: photoURL }} style={styles.avatar} />
            <Text category="h1" style={styles.username}>
              {displayName}
            </Text>
            <Divider style={styles.divider} />
            <Text style={styles.bio}>Game Attendance Rate (100%)</Text>
          </Card>

          <Layout style={styles.section} level="2">
            <Text category="h4" style={styles.sectionTitle}>
              Favourites
            </Text>
            <Divider style={styles.divider}></Divider>
            <FlatList
              data={wishlist}
              renderItem={renderGameItem}
              keyExtractor={(item, index) => item.eventID || index}
              numColumns={2}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text category="h6" style={styles.emptyList}>
                  No favourite games...
                </Text>
              }
            />
          </Layout>

          <Layout style={styles.section} level="2">
            <Text category="h4" style={styles.sectionTitle}>
              Owned Games
            </Text>
            <Divider style={styles.divider}></Divider>
            <FlatList
              data={owned}
              renderItem={renderGameItem}
              keyExtractor={(item, index) => item.eventID || index}
              numColumns={2}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text category="h6" style={styles.emptyList}>
                  No owned games...
                </Text>
              }
            />
          </Layout>

          <Layout style={styles.section} level="2">
            <Text category="h4" style={styles.sectionTitle}>
              Joined Events
            </Text>
            <Divider style={styles.divider}></Divider>
            <FlatList
              data={events}
              renderItem={renderEventItem}
              keyExtractor={(item, index) => item.eventID || index}
              numColumns={2}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text category="h6" style={styles.emptyList}>
                  No events joined...
                </Text>
              }
            />
          </Layout>

          <Layout style={styles.section} level="2">
            <Text category="h4" style={styles.sectionTitle}>
              My Events
            </Text>
            <Divider style={styles.divider}></Divider>
            <FlatList
              data={myEventsList}
              renderItem={renderMyEventItem}
              keyExtractor={(item, index) => item.eventID || index}
              numColumns={2}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text category="h6" style={styles.emptyList}>
                  No events created...
                </Text>
              }
            />
          </Layout>
        </Layout>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141427",
    paddingTop: StatusBar.currentHeight || 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileBox: {
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
    paddingTop: 10,
    marginBottom: 0,
  },
  profileBox: {
    status: "primary",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
    margin: 16,
  },
  avatar: {
    alignSelf: "center",
    marginBottom: 8,
    width: 100,
    height: 100,
  },
  username: {
    marginBottom: 4,
    alignSelf: "center",
  },
  bio: {
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
    backgroundColor: "#00d6a0",
  },
  section: {
    width: "90%",
    marginBottom: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  sectionTitle: {
    textAlign: "center",
    margin: 8,
  },
  gameItemContainer: {
    flex: 1,
    margin: 10,
    padding: 0,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  gameTitle: {
    marginTop: 4,
    alignSelf: "center",
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
    alignSelf: "center",
  },
  emptyList: {
    alignSelf: "center",
    margin: 16,
  },
  button: {
    margin: 0,
    backgroundColor: "none",
  },
});

export default Profile;
