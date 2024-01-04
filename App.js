import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthNav from "./src/Components/Navigation/AuthNav";
import LandingPage from "./src/Components/Screens/LandingPage";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import Theme from './assets/Themes.json'
import { UserProvider } from "./Context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...Theme }}>
        <NavigationContainer>
          <AuthNav />
        </NavigationContainer>
      </ApplicationProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
