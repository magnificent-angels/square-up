import * as React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../Screens/SignUp";
import SignIn from "../Screens/SignIn";
import LandingPage from "../Screens/LandingPage";

const Stack = createNativeStackNavigator();

function AuthNav() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

export default AuthNav;
