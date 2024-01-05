import React, { useState } from 'react'
import { SearchBar } from "@rneui/themed";
import GameScreen from './GameScreen';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function SearchScreen() {
    const [search, setSearch] = useState("");
    const [editSearch, setEditSearch] = useState("");

    function onSubmit() {
        setSearch(editSearch);
        setEditSearch("");
    }

    return (
        <>
            <SafeAreaView>
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
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight || 0
    }
})