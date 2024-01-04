import { View, Button, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";

function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser } = useContext(UserContext);
  const nav = useNavigation();

  const onSubmit = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userCred = userCredential.user;
        setUser(userCred);
        nav.navigate("Profile");
        //console.log(userCred);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.formHeader}>Log In</Text>

        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          // rules={emailValidation}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput style={styles.input} placeholder="Email" onBlur={onBlur} onChangeText={onChange} value={value} />
          )}
          name="email"
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          // rules={passwordValidation}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />

        {/* <Pressable
          id="login-submit"
          role="button"
          aria-label="Submit details"
          style={{ width: 100, height: 20, border: 2 }}
          onPress={() => {
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in
                const userCred = userCredential.user;
                setUser(userCred);
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
        > */}
        {/* Insert button-type component here, placeholder text below */}
        {/* <Text>Submit</Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}

export default SignIn;

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
