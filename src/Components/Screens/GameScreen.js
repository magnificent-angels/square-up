import getGame from "../../utils/gamesApi";
import { useState, useEffect } from "react";
import { View, Image, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Text } from "@ui-kitten/components";

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

  if (isError) return <Error msg="Game not found" />;

  const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } =
    game;

  return (
    <View>
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
          <Button title="Add to wishlist"></Button>
          <Button
            onPress={() => nav.navigate("CreateEvent")}
            title="Create event"
          ></Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
    marginTop: 70,
    marginHorizontal: 80,
  },
  name: {
    fontSize: 40,
    justifyContent: "center",
  },
});

export default GameScreen;
