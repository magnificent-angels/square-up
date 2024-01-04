import { View, Text } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "../Screens/Home";
import Map from "../Screens/Map";
import { SafeAreaView } from "react-native-safe-area-context";

const TopTab = createMaterialTopTabNavigator();

const TopNav = () => {
  return (
    <TopTab.Navigator screenOptions={{ headerShown: false }}>
      <TopTab.Screen name="Game Search" component={Home} />
      <TopTab.Screen name="Games Near Me" component={Map} />
      </TopTab.Navigator>
  );
};

export default TopNav;
