import { View, Text, TextInput, Pressable } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import { useNavigation } from "@react-navigation/native";

function SignIn() {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const nav = useNavigation();

  return (
    <View>
      <Text>
        Enter your email:
        <br></br>
        <TextInput
          id="email"
          placeholder="Enter your email address"
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
      </Text>
      <Text>
        Password:
        <br></br>
        <TextInput
          id="password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry
        />
      </Text>
      <Pressable
        id="login-submit"
        role="button"
        aria-label="Submit details"
        style={{ width: 100, height: 20, border: 2 }}
        onPress={() => {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in
              const userCred = userCredential.user;
              setUser(userCred)
              nav.navigate("Profile");
              console.log(userCred);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(error);
            });
          setEmail("");
          setPassword("");
        }}
      >
        {/* Insert button-type component here, placeholder text below */}
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
}

export default SignIn;