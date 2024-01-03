import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";

function LandingPage() {
  const { user } = useContext(UserContext);
  const nav = useNavigation();

  return (
    <View>
      {!user ? (
        <>
          <Text>Logo goes here</Text>
          <Pressable
            onPress={() => {
              nav.navigate("SignUp");
            }}
          >
            <Text>Sign up</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              nav.navigate("SignIn");
            }}
          >
            <Text>Sign in</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          onPress={() => {
            nav.navigate("Profile");
          }}
        >
          <Text>Go to Profile</Text>
        </Pressable>
      )}
    </View>
  );
}

export default LandingPage;