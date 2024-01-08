import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, TouchableOpacity, View, Keyboard } from "react-native";
import { Layout, Input, Button, Card, Text } from '@ui-kitten/components';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../../Context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";

function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
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
        const userCred = userCredential.user;
        setUser(userCred);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Layout style={styles.container}>
        <View disabled={true} style={styles.card}>
          <Text category='h1' style={styles.formHeader}>Log In</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label='Email'
                placeholder="Enter your email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label='Password'
                placeholder="Enter your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                style={styles.input}
              />
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

          <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
            Submit
          </Button>
          <TouchableOpacity onPress={() => nav.navigate('SignUp')}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </TouchableWithoutFeedback>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: 16,
  },
  input: {
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    marginTop: 15,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  formHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  link: {
    alignSelf: 'center',
    marginTop: 15,
    fontSize: 16,
  }
});
