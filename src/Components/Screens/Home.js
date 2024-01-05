import { View, Text } from "react-native";
import { useState } from "react";
import GameScreen from "./GameScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "./Map";

function Home() {
  return (
    <>
      <Map />
    </>
  );
}

export default Home;
