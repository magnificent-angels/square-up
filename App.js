import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthNav from "./src/Components/Navigation/AuthNav";
import { UserProvider } from "./Context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AuthNav />
      </NavigationContainer>
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