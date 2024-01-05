import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../Screens/Profile";
import Map from "../Screens/Map";
import SearchScreen from "../Screens/SearchScreen";
import MessageHub from "../Screens/MessageHub";

const Tab = createBottomTabNavigator();

function BottomNav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Map} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="MessageHub" component={MessageHub} />
    </Tab.Navigator>
  );
}
export default BottomNav;
