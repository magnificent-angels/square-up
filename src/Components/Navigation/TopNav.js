import { View, Text } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "../Screens/Home";
import Map from "../Screens/Map";

const TopTab = createMaterialTopTabNavigator();

const TopNav = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Home" component={Home} />
      <TopTab.Screen name="Map" component={Map} />
    </TopTab.Navigator>
  );
};

export default TopNav;
