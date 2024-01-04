import { View, Text, Pressable } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../../Context/UserContext";
import { useContext } from "react";

function SignOut() {
  const { user, setUser } = useContext(UserContext);
  const nav = useNavigation();
  console.log(user);
  return (
    <View>
      <Pressable
        onPress={() => {
          signOut(auth)
            .then(() => {
              nav.navigate("LandingPage");
              // setUser(null);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}

export default SignOut;
