import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";

function LandingPage() {
  const { user } = useContext(UserContext);
  const nav = useNavigation();

  return (
    <View style={styles.container}>
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
