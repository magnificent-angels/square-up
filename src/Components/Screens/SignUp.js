import { useState } from "react";
import { View, Text, StyleSheet, Form, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SignUp() {
  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = () => {
    //Add logic to submit to firebase
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if(!phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Sign Up</Text>
        <TextInput
          placeholder="Full Name"
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder="Phone Number"
          onChangeText={text => setPhoneNumber(text)}
        />
        <TextInput
          placeholder="Email"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => handleSubmit()}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});



