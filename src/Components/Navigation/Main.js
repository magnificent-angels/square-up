import { View, Text, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import AuthNav from "./AuthNav";
import MainNav from "./MainNav";
import { UserContext } from "../Context/UserContext";

const Main = () => {
  const [loading, setLoading] = useState();

  const { user } = useContext(UserContext);

  return <>{user ? <MainNav /> : <AuthNav />}</>;
};

export default Main;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 0,
  },
});
