import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home"
import Profile from '../Screens/Profile'
import {useState} from 'react'
import TopNav from "./TopNav";

const Tab = createBottomTabNavigator()

function BottomTav(){
  
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={TopNav} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
}
export default BottomTav;