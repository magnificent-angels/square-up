import { StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";
import { Text } from "@ui-kitten/components";
import { Button } from "@ui-kitten/components";
import { StatusBar } from "react-native";

function SignOut() {
  const { user, setUser } = useContext(UserContext);
  const nav = useNavigation();

  return (
    <Button
      style={styles.pressable}
      onPress={() => {
        signOut(auth)
          .then(() => {
            nav.navigate("LandingPage");
          })
          .catch((error) => {
            console.log(error);
          });
      }}
    >
      <Text>Sign Out</Text>
    </Button>
  );
}

export default SignOut;

const styles = StyleSheet.create({
  pressable: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    maxWidth: "40%",
    alignSelf: "flex-end",
    marginRight: 15,
  },
});
