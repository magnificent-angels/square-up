import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNav from './BottomNav';
import CreateEvent from '../Screens/CreateEvent';
import SetupProfileScreen from "../Screens/SetProfile";

const MainStack = createNativeStackNavigator();

function MainNav() {
    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="Root Nav" component={BottomNav} />
            <MainStack.Screen name="SetupProfile" component={SetupProfileScreen} />
        </MainStack.Navigator>
    );
}

export default MainNav;