import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, TouchableOpacity, View, Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Layout, Text, Input, Button, Spinner } from '@ui-kitten/components';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigation } from "@react-navigation/native";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const nav = useNavigation();

  const onSubmit = ({ email, password, username, fullName }) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userUid = doc(db, "users", user.uid);
        setDoc(userUid, {
          username: username,
          name: fullName
        });
      })
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: username,
        });
      })
      .catch((error) => {
        console.log(error); 
      })
      .finally(() => {
        setTimeout(() => {
          nav.reset({
            index: 2,
            routes: [{ name: 'SetupProfile', screen: 'SetupProfileScreen' }],
          });
          setLoading(false);
        }, 500);
      });
  };

  const emailValidation = {
    required: { value: true, message: "Email is required" },
    pattern: {
      value:
        /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])/,
      message: "Invalid email",
    },
  };

  const passwordValidation = {
    required: { value: true, message: "Password is required" },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      message: "Invalid password",
    },
  };

  const confirmPasswordValidation = {
    required: { value: true, message: "Please confirm your password" },
    validate: {
      matchesPreviousPassword: (value) => {
        const { password } = getValues();
        return password === value || "Passwords should match!";
      },
    },
  };

  if (loading) {
    return (
      <Layout style={styles.container}>
        <Spinner size='giant'/>
      </Layout>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Layout style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.formHeader}>Sign Up</Text>
            <Controller
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  style={styles.input}
                  placeholder="Full Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label="Full Name"
                />
              )}
              name="fullName"
            />
            {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}

            <Controller
              control={control}
              rules={{ required: "Username is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  style={styles.input}
                  placeholder="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label="Username"
                />
              )}
              name="username"
            />
            {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

            <Controller
              control={control}
              rules={emailValidation}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  style={styles.input}
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label="Email"
                />
              )}
              name="email"
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
              control={control}
              rules={passwordValidation}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  style={styles.input}
                  placeholder="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  label="Password"
                />
              )}
              name="password"
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <Controller
              control={control}
              rules={confirmPasswordValidation}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  style={styles.input}
                  placeholder="Confirm Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  label="Confirm Password"
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

            <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
              Sign Up
            </Button>
            <TouchableOpacity onPress={() => nav.navigate('SignIn')}>
              <Text style={styles.link}>Have an account? Log in</Text>
            </TouchableOpacity>
          </View>
        </Layout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pagerView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    justifyContent: 'center',
    padding: 10,
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

export default SignUp;
