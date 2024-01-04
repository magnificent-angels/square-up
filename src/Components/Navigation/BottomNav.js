import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home"
import Profile from '../Screens/Profile'
import {useState} from 'react'

const Tab = createBottomTabNavigator()

function BottomTab(){
  
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
}
export default BottomTab