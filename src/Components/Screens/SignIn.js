import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
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
        nav.navigate("Profile");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Layout style={styles.container}>
      <Card disabled={true} style={styles.card}>
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
      </Card>
    </Layout>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: 16,
  },
  formHeader: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
