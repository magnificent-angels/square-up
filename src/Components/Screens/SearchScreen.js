import React, { useState } from "react";
import { SearchBar } from "@rneui/themed";
import GameScreen from "./GameScreen";
import { Layout } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

function SearchScreen() {
  const [search, setSearch] = useState("");
  const [editSearch, setEditSearch] = useState("");

  function onSubmit() {
    setSearch(editSearch);
    setEditSearch("");
  }

  return (
    <Layout style={styles.container}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={(input) => {
          setEditSearch(input);
        }}
        value={editSearch}
        onSubmitEditing={onSubmit}
      />
      {search ? <GameScreen search={search} /> : null}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
});

export default SearchScreen;
