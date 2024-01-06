import { View, StyleSheet } from "react-native";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import SignOut from "./SignOut";
import {
  Layout,
  Card,
  Text,
  Button,
  Avatar,
  Divider,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";

function Profile() {
  const { user } = useContext(UserContext);

  return (
    <>
      <View style={styles.container}>
        <SignOut />
        <Card style={styles.profileContainer}>
          <Avatar
            size="giant"
            source={require("../../../assets/avatars/Avatar3.png")}
            style={styles.content}
          />
          <Text category="h1" status="info">
            John Doe
          </Text>
          <Divider />
          <Text category="s1" style={styles.content}>
            No Shows: 0
          </Text>
        </Card>
        <Card style={styles.contentContainer}>
          <Ionicons
            name="create"
            style={styles.editIcon}
            size={25}
            onPress={console.log("edit favourites")}
          />
          <Text category="s2" style={styles.editDescription}>
            Edit
          </Text>
          <Text category="h5">Favourite Games</Text>

          <Divider />
          <Text category="s1" style={styles.content}>
            No Favourite Games
          </Text>
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
          <Text category="s1" style={styles.content}>
            No Owned Games
          </Text>
        </Card>
        <Card style={styles.contentContainer}>
          <Text category="h5">Joined Events</Text>
          <Divider />
          <Text category="s1" style={styles.content}>
            No Events Joined
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
  },
  editIcon: {
    top: 2,
    right: -60,
    index: 1,
    position: "absolute",
  },
  editDescription: {
    top: 8,
    right: -35,
    index: 1,
    position: "absolute",
  },
  createIcon: {
    top: 1,
    right: -75,
    index: 1,
    position: "absolute",
  },
  createDescription: {
    top: 5,
    right: -50,
    index: 1,
    position: "absolute",
  },
});
