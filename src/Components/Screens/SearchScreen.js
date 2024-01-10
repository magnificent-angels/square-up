import React, { useState } from "react";
import { Input, Icon, Layout, Text, Card } from "@ui-kitten/components";
import GameScreen from "./GameScreen";
import { Dimensions, Image, StyleSheet } from "react-native";
import { StatusBar } from "react-native";

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

function SearchScreen() {
  const [search, setSearch] = useState("");
  const [editSearch, setEditSearch] = useState("");

  const onSubmit = () => {
    setSearch(editSearch);
    setEditSearch("");
  };

  return (
    <Layout style={styles.container} level="4">
      <Input
        placeholder="Search for a game..."
        value={editSearch}
        accessoryRight={SearchIcon}
        onChangeText={(input) => setEditSearch(input)}
        onSubmitEditing={onSubmit}
        style={styles.input}
      />
      {search ? (
        <GameScreen search={search} />
      ) : (
        <>
          <Card style={styles.searchSplash}>
            <Image source={require("../../../assets/search-heart.png")} style={styles.searchImage} />
            <Text category="h5" style={{ alignSelf: "center" }}>
              Search for a game!
            </Text>
          </Card>
        </>
      )}
    </Layout>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    margin: 10,
    padding: 15,
  },
  searchImage: {
    width: 300,
    height: 300,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: Dimensions.get("window").height / 10,
  },
  searchSplash: {
    flex: 1,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    borderColor: "#00d6a0",
  },
});
