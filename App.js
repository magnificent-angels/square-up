import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthNav from "./src/Components/Navigation/AuthNav";
import LandingPage from "./src/Components/Screens/LandingPage";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import Theme from './assets/Themes.json'

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{...eva.light, ...Theme}}>
      <NavigationContainer>
        <AuthNav />
      </NavigationContainer>
    </ApplicationProvider>
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
