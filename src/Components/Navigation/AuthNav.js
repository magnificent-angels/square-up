import * as React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../Screens/SignUp";
import SignIn from "../Screens/SignIn";
import LandingPage from "../Screens/LandingPage";
import Profile from "../Screens/Profile";
import GameScreen from "../Screens/GameScreen";
import Home from "../Screens/Home";
import CreateEvent from "../Screens/CreateEvent";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";

const Stack = createNativeStackNavigator();

function AuthNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={BottomNav} />
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="CreateEvent" component={CreateEvent}/>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

export default AuthNav;