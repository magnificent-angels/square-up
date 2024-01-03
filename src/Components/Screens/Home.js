import { View, Text } from "react-native";
import {useState} from 'react'
import { SearchBar } from '@rneui/themed'
import GameScreen from "./GameScreen";

function Home() {
  const [search, setSearch] = useState("")
  const [editSearch, setEditSearch] = useState("")

  function onSubmit(){
    setSearch(editSearch)
    setEditSearch("")
  }

  function onChange(input) {
    setEditSearch(input)
  }

  return (
    <>
    <View>
      <Text>Home</Text>
    </View>

    <View>
    <SearchBar
      placeholder="Type Here..."
      onChangeText={onChange}
      value={editSearch}
      onSubmitEditing={onSubmit}
    />
    {search ? <GameScreen search={search} /> : null}
    </View>
    </>
  );
}

export default Home;
