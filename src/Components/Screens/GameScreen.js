import { Layout, Text } from "@ui-kitten/components";
import getGame from "../../utils/gamesApi";
import { useState, useEffect, useContext } from "react";
import { View, Image, Button, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CreateEvent from "./CreateEvent";
import { auth, db } from "../../firebase";
import {
  setDoc,
  doc,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { UserContext } from "../Context/UserContext";

const Error = (props) => {
  const { msg } = props;
  return (
    <View>
      <Text>{msg}</Text>
    </View>
  );
};

function GameScreen({ search }) {
  const nav = useNavigation();
  const [game, setGame] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [eventBeingCreated, setEventBeingCreated] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    getGame(search)
      .then((gameData) => {
        setGame(gameData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [search]);

  const uid = user.uid;
  const userUid = doc(db, "users", uid);

  function addToWishlist(game) {
    updateDoc(userUid, {
      wishlist: arrayUnion({name: game.name, url: game.imageUrl}),
    })
  }

  if (isError) return <Error msg="Game not found" />;

  const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } =
    game;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={"handled"}
      alwaysBounceVertical={false}
      contentContainerStyle={styles.container}
    >
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.container}>
          <Text style={styles.name}>{name}</Text>
          <Image
            source={{ uri: `${imageUrl}` }}
            style={{ width: 100, height: 100 }}
          ></Image>
          <Text>
            {minPlayers} - {maxPlayers} players
          </Text>
          <Text>Approximate play time: {playingTime} minutes</Text>
          <Button title="I own this game"></Button>
          <Button
            onPress={() => {
              addToWishlist(game);
            }}
            title="Add to wishlist"
          ></Button>
          <Button
            onPress={() => {
              setEventBeingCreated(true);
            }}
            title="Create event"
          ></Button>
          {eventBeingCreated ? (
            <CreateEvent
              game={game}
              setEventCreated={setEventCreated}
              setEventBeingCreated={setEventBeingCreated}
            />
          ) : null}
          {eventCreated ? <Text>Your event has been created!</Text> : null}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 70,
  },
  name: {
    fontSize: 40,
    justifyContent: "center",
  },
});

export default GameScreen;
