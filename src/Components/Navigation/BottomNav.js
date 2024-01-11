import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../Screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import Home from "../Screens/Home";
import SearchScreen from "../Screens/SearchScreen";
import Messages from "../Screens/Messages";

const Tab = createBottomTabNavigator();

function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#101426", borderTopColor: "#006760", borderTopWidth: 2 },
        tabBarActiveTintColor: "#06D6A0",
        tabBarInactiveTintColor: "#5a5a5a",
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconColor;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
            iconColor = focused ? "#06D6A0" : "#5A5A5A";
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-person" : "ios-person-outline";
            iconColor = focused ? "#06D6A0" : "#5A5A5A";
          } else if (route.name === "Search") {
            iconName = focused ? "ios-search" : "ios-search-outline";
            iconColor = focused ? "#06D6A0" : "#5A5A5A";
          } else if (route.name === "Messages") {
            iconName = focused ? "ios-chatbubbles" : "ios-chatbubbles-outline";
            iconColor = focused ? "#06D6A0" : "#5A5A5A";
          }
          return <Ionicons name={iconName} size={size - 4} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#101426",
          },
          headerTintColor: "#06D6A0",
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomNav;
