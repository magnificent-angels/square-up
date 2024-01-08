import { View, StyleSheet, Image, FlatList, List } from "react-native";
import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import SignOut from "./SignOut";
import { Layout, Card, Text, Button, Avatar, Divider } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";

function Profile() {
  const { user, wishlist, setWishlist, owned, setOwned, events, setEvents } = useContext(UserContext);
  const { photoURL, displayName, uid } = user

  useEffect(() => {
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
    .then((result) => {
      const userData = result.data()
      setWishlist(userData.wishlist)
      setOwned(userData.owned)
      setEvents(userData.events)
    })
  }, [])

  const renderListItem = ({ item }) => (
    <View>
        <Text style={styles.listItem}>{item.name}</Text>
        <Image source={{ uri: item.url }} style={styles.listImage} />
    </View>
);


  return (
    <>
      <View style={styles.container}>
        <SignOut />
        <Card style={styles.profileContainer}>
          <Avatar size="giant" source={{ uri: `${photoURL}`}} style={styles.content} />
          <Text category="h1" status="info">
            {displayName}
          </Text>
          <Divider />
          <Text category="s1" style={styles.content}>
            No Shows: 0
          </Text>
        </Card>
        <Card style={styles.contentContainer}>
          <Ionicons name="create" style={styles.editIcon} size={25} onPress={console.log("edit favourites")} />
          <Text category="s2" style={styles.editDescription}>
            Edit
          </Text>
          <Text category="h5">Favourite Games</Text>
          <Divider />
          <FlatList
              style={styles.listItem}
              data={wishlist}
              renderItem={renderListItem}
              keyExtractor={item => item.name}
              ListEmptyComponent={<Text>No favourited games</Text>}
              />
        </Card>
        <Card style={styles.contentContainer}>
          <Text category="s2" style={styles.createDescription}>
            Create Event
          </Text>
          <Ionicons
            name="add-circle-outline"
            style={styles.createIcon}
            size={25}
            onPress={console.log("create an event")}
          />
          <Text category="h5">Owned Games</Text>
          <Divider />
            <FlatList
              style={styles.list}
              data={owned}
              renderItem={renderListItem}
              keyExtractor={item => item.name}
              ListEmptyComponent={<Text>No owned games</Text>}
              />
        </Card>
        <Card style={styles.contentContainer}>
          <Text category="h5">Joined Events</Text>
          <Divider />
          <Text category="s1" style={styles.content}>
            {events.length === 0 ? "No Events Joined" : console.log(events)}
          </Text>
        </Card>
      </View>
    </>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  profileContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#2766f9",
    borderTopColor: "#2766f9",
    borderTopWidth: 8,
    boxShadow: "0px 0px 5px 5px rgba(0,0,0,0.9)",
  },
  content: {
    alignSelf: "center",
  },
  contentContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#2766f9",
    borderTopColor: "#2766f9",
    borderTopWidth: 4,
    boxShadow: "0px 0px 5px 5px rgba(0,0,0,0.9)",
    position: "relative",
    padding: 5,
  },
  editIcon: {
    top: 2,
    right: -60,
    position: "absolute",
    color: "white",
  },
  editDescription: {
    top: 8,
    right: -35,
    position: "absolute",
  },
  createIcon: {
    top: 1,
    right: -75,
    position: "absolute",
    color: "white",
  },
  createDescription: {
    top: 5,
    right: -50,
    position: "absolute",
  },
  listItem: {
    padding: 5,
    fontSize: 18,
  },
  listImage: {
    padding: 5,
    width: 25,
    height: 25
  }
});
