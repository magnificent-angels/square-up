import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../Screens/Profile";
import { Ionicons } from '@expo/vector-icons';
import Map from "../Screens/Map";
import SearchScreen from "../Screens/SearchScreen";
import Threads from "../Screens/Threads";


const Tab = createBottomTabNavigator();

function BottomNav() {
  return (

    <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-home'
              : 'ios-home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          } else if (route.name ==="Search") {
            iconName = focused ? 'ios-search' : 'ios-search-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={Map} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Threads" component={Threads} />
    </Tab.Navigator>
  );
}
export default BottomNav;
