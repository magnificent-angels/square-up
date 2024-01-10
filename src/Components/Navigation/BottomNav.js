import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../Screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import Map from "../Screens/Map";
import SearchScreen from "../Screens/SearchScreen";
import Messages from "../Screens/Messages";

const Tab = createBottomTabNavigator();

function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#06d6a0" },
        tabBarActiveTintColor: "#fff",
        tabInactiveTintColor: "#5A5A5A",
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconColor;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
            iconColor = focused ? "#fff" : "#5A5A5A";
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-person" : "ios-person-outline";
            iconColor = focused ? "#fff" : "#5A5A5A";
          } else if (route.name === "Search") {
            iconName = focused ? "ios-search" : "ios-search-outline";
            iconColor = focused ? "#fff" : "#5A5A5A";
          } else if (route.name === "Messages") {
            iconName = focused ? "ios-chatbubbles" : "ios-chatbubbles-outline";
            iconColor = focused ? "#fff" : "#5A5A5A";
          }
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Map} />
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
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomNav;
