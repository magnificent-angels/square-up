import { Layout, Text } from "@ui-kitten/components";
import getGame from "../../utils/gamesApi";
import { useState, useEffect } from "react";
import { View, Image, Button, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CreateEvent from "./CreateEvent";

const Error = (props) => {
  const { msg } = props;
  return (
    <View>
      <Text>{msg}</Text>
    </View>
  );
};

function GameScreen({ search }) {
    const nav = useNavigation()
    const [game, setGame] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [eventBeingCreated, setEventBeingCreated] = useState(false)
    const [eventCreated, setEventCreated] = useState(false)

    useEffect(() => {
        setIsError(false)
        setIsLoading(true)
        getGame(search)
            .then((gameData) => {
                setGame(gameData)
                setIsLoading(false)
            })
            .catch(() => {
                setIsError(true)
                setIsLoading(false)
            })
    }, [search])

    if (isError) return <Error msg="Game not found" />

    const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } = game

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"handled"}
            alwaysBounceVertical={false}
            contentContainerStyle={styles.container}
        >
            {isLoading ? <Text>Loading...</Text> :
                <View style={styles.container}>
                    <Text style={styles.name}>{name}</Text>
                    <Image source={{ uri: `${imageUrl}` }} style={{ width: 100, height: 100 }}></Image>
                    <Text>{minPlayers} - {maxPlayers} players</Text>
                    <Text>Approximate play time: {playingTime} minutes</Text>
                    <Button title="I own this game"></Button>
                    <Button title="Add to wishlist"></Button>
                    <Button onPress={() => {setEventBeingCreated(true)}} title="Create event" ></Button>
                    { eventBeingCreated ? <CreateEvent game={game} setEventCreated={setEventCreated} setEventBeingCreated={setEventBeingCreated} /> : null }
                    { eventCreated ? <Text>Your event has been created!</Text> : null}
                </View>
            }
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 70,
        marginBottom: 70
    },
    name: {
        fontSize: 40,
        justifyContent: "center",
    }
})

export default GameScreen;
