import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../Screens/Profile";
import { Ionicons } from "@expo/vector-icons";
// import Map from "../Screens/Map";
import SearchScreen from "../Screens/SearchScreen";
import Messages from "../Screens/Messages";
import EventList from "../Screens/EventList";

const Tab = createBottomTabNavigator();

function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-person" : "ios-person-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "ios-search" : "ios-search-outline";
          } else if (route.name === "Messages") {
            iconName = focused ? "ios-chatbubbles" : "ios-chatbubbles-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={EventList} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: true,
        }}
      />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomNav;
