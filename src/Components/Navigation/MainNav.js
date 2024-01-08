import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNav from "./BottomNav";
import CreateEvent from "../Screens/CreateEvent";
import Chat from "../Screens/Chat";

const MainStack = createNativeStackNavigator();

function MainNav() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Root Nav" component={BottomNav} />
      <MainStack.Screen name="CreateEvent" component={CreateEvent} />
      <MainStack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({ title: route.params.name, headerShown: true })}
      />
    </MainStack.Navigator>
  );
}

export default MainNav;
