import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  Layout,
  Text,
  Avatar,
  Divider,
  Card,
  Spinner,
} from "@ui-kitten/components";
import { UserContext } from "../Context/UserContext";
import SignOut from "./SignOut";
import { db } from "../../firebase";
import { getDoc, doc, startAfter } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, wishlist, setWishlist, owned, setOwned, events, setEvents } =
    useContext(UserContext);
  const { photoURL, displayName, uid } = user;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "users", uid);
    getDoc(docRef).then((result) => {
      setLoading(false);
      const userData = result.data();
      setWishlist(userData.wishlist);
      setOwned(userData.owned);
      setEvents(userData.events);
    });
  }, []);

  const renderGameItem = ({ item }) => (
    <Card style={styles.gameItemContainer} disabled>
      <Avatar source={{ uri: item.url }} style={styles.image} />
      <Text category="c1" style={styles.gameTitle} numberOfLines={1}>
        {item.name}
      </Text>
    </Card>
  );

  if (loading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Layout style={styles.parentContent} level="4">
          <SignOut />
          <Card style={styles.profileBox} disabled>
            <Avatar
              size="giant"
              source={{ uri: photoURL }}
              style={styles.avatar}
            />
            <Text category="h1" style={styles.username}>
              {displayName}
            </Text>
            <Divider style={styles.divider} />
            <Text style={styles.bio}>Game Attendance Rate (100%)</Text>
          </Card>

          <Section
            title="Wishlist"
            data={wishlist}
            renderItem={renderGameItem}
          />
          <Section
            title="Owned Games"
            data={owned}
            renderItem={renderGameItem}
          />
          <Section
            title="Joined Events"
            data={events}
            renderItem={renderGameItem}
          />
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, data, renderItem }) => (
  <Layout style={styles.section} level="2">
    <Text category="h4" style={styles.sectionTitle}>
      {title}
    </Text>
    <Divider style={styles.divider} />
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      numColumns={2}
      scrollEnabled={false}
      ListEmptyComponent={
        <Text style={styles.emptyList}>No items found...</Text>
      }
    />
  </Layout>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141427",
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 5,
    minHeight: "104%",
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
  },
  emptyList: {
    alignSelf: "center",
    margin: 16,
  },
  button: {
    margin: 0,
    backgroundColor: "none",
  },
  parentContent: {
    paddingTop: 10,
  },
});

export default Profile;
