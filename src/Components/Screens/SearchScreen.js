import React, { useState } from 'react'
import { SearchBar } from "@rneui/themed";
import GameScreen from './GameScreen';

function SearchScreen() {
    const [search, setSearch] = useState("");
    const [editSearch, setEditSearch] = useState("");

    function onSubmit() {
        setSearch(editSearch);
        setEditSearch("");
    }

    return (
        <>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={(input) => {
                    setEditSearch(input);
                }}
                value={editSearch}
                onSubmitEditing={onSubmit}
            />
            {search ? <GameScreen search={search} /> : null}
        </>
    )
}

export default SearchScreen