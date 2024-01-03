import { View, Text, Pressable } from "react-native";
import { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import SignOut from "./SignOut";

function Profile() {
  return (
    <View>
      <Text>Profile</Text>
      <SignOut />
    </View>
  );
}

export default Profile;