import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home"
import Profile from '../Screens/Profile'
import {useState} from 'react'
import TopNav from "./TopNav";
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

function BottomTav(){
  
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-home'
              : 'ios-home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
        <Tab.Screen name="Home" component={TopNav} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
}
export default BottomTav;