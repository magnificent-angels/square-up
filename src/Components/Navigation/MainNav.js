import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNav from "./BottomNav";
import Chat from "../Screens/Chat";
import EventList from "../Screens/EventList";
import SetupProfileScreen from "../Screens/SetProfile";
import EventDetails from "../Screens/EventDetails";
const MainStack = createNativeStackNavigator();

function MainNav() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Root Nav" component={BottomNav} />
      <MainStack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({ title: route.params.name, headerShown: true })}
      />
      <MainStack.Screen name="SetupProfile" component={SetupProfileScreen} />
      <MainStack.Screen
        name="EventList"
        component={EventList}
        options={{
          headerShown: true,
          headerTitle: "Event List",
          headerStyle: {
            backgroundColor: "#101426",
          },
          headerTintColor: "#06D6A0",
        }}
      />
      <MainStack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{
          headerShown: true,
          headerTitle: "Event",
          headerStyle: {
            backgroundColor: "#101426",
          },
          headerTintColor: "#06D6A0",
        }}
      />
    </MainStack.Navigator>
  );
}

export default MainNav;
