import { View, Text } from "react-native";
import { useState } from "react";
import { SearchBar } from "@rneui/themed";
import GameScreen from "./GameScreen";
// import Map from "./Map";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
  const [search, setSearch] = useState("");
  const [editSearch, setEditSearch] = useState("");

  function onSubmit() {
    setSearch(editSearch);
    setEditSearch("");
  }

  return (
    <>
      <SafeAreaView>
        <Text>Home</Text>

        <SearchBar
          placeholder="Type Here..."
          onChangeText={(input) => {
            setEditSearch(input);
          }}
          value={editSearch}
          onSubmitEditing={onSubmit}
        />
        {search ? <GameScreen search={search} /> : null}
      </SafeAreaView>
    </>
  );
}

export default Home;
