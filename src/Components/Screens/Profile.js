import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import SignOut from "./SignOut";

function Profile() {
  const { user } = useContext(UserContext);
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <SignOut />
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "80%",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  formHeader: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
});
