import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../Screens/Profile";
import Map from "../Screens/Map";
import SearchScreen from "../Screens/SearchScreen";
import Threads from "../Screens/Threads";

const Tab = createBottomTabNavigator();

function BottomNav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={Map} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Threads" component={Threads} />
    </Tab.Navigator>
  );
}
export default BottomNav;
