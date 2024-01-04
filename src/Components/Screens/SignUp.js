import React from 'react';
import { StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Layout, Text, Card, Input, Button } from '@ui-kitten/components';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = ({ email, password }) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });
  };

  const phoneNumberValidation = {
    required: { value: true, message: "Phone number is required" },
    pattern: {
      value: /((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/,
      message: "Invalid UK phone number",
    },
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
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
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

  return (

    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Card style={styles.form} status="primary" >
        <Text >Sign Up</Text>

        <Controller
          control={control}
          rules={{ required: "Full name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Full Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label={"Full Name"}
            />
          )}
          name="fullName"
        />
        {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}

        <Controller
          control={control}
          rules={phoneNumberValidation}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="+44"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label={"Phone Number"}
            />
          )}
          name="phoneNumber"
        />
        {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber.message}</Text>}

        <Controller
          control={control}
          rules={emailValidation}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label={"Email"}
            />
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          rules={passwordValidation}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              label={"Password"}
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
              placeholder="Confirm Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              label={"Confirm Password"}
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

        <Button onPress={handleSubmit(onSubmit)} style={{paddingTop: '10px'}}>
          Sign Up
        </Button>
      </Card>
    </Layout>
  );
}

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

export default SignUp;
