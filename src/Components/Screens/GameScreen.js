import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Layout, Text, Button, Spinner, Modal } from "@ui-kitten/components";
import getGame from "../../utils/gamesApi";
import CreateEvent from "./CreateEvent";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

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
  getDoc,
} from "firebase/firestore";
import { UserContext } from "../Context/UserContext";

const Error = ({ msg }) => <Text category="h6">{msg}</Text>;

function GameScreen({ search }) {
  const [game, setGame] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventBeingCreated, setEventBeingCreated] = useState(false)
  const [eventCreated, setEventCreated] = useState(false);
  const notFoundAnimation = useRef(null);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [ownedAdded, setOwnedAdded] = useState(null);
  const { user, wishlist, setWishlist, owned, setOwned } =
    useContext(UserContext);
  const [ownedButtonText, setOwnedButtonText] = useState('')
  const [wishlistButtonText, setWishlistButtonText] = useState('')

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef)
      .then((result) => {
        const userData = result.data();
        setOwned(userData.owned);
        const ownedCheck = owned.some((game) => game.name === search);
        setOwnedAdded(ownedCheck);
        if (ownedCheck) {
          setOwnedButtonText('You own this game!')
        } else {
          setOwnedButtonText('Add to owned games')
        }
        setWishlist(userData.wishlist);
        const wishlistCheck = wishlist.some((game) => game.name === search);
        setWishlistAdded(wishlistCheck);
        if (wishlistCheck) {
          setWishlistButtonText('You like this game!')
        } else {
          setWishlistButtonText('Add to favourites')
        }
        return getGame(search);
      })
      .then((gameData) => {
        setGame(gameData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
      })
  }, [search]);

  if (isError)
    return (
      <Layout style={styles.notFoundContainer}>
        <LottieView
          autoPlay
          ref={notFoundAnimation}
          style={styles.notFound}
          source={require("../../../assets/animations/404.json")}
          speed={1}
          loop={true}
        />
        <Error msg="Sorry, we couldn’t find that game :(" />
      </Layout>
    );

  const { name, minPlayers, maxPlayers, playingTime, imageUrl } = game;

  const uid = user.uid;
  const userUid = doc(db, "users", uid);

  function handleWishlistButton(game) {
    if (!wishlistAdded) {
      setWishlistAdded(true)
      setWishlistButtonText('You like this game!')
      setWishlist([...wishlist, { name: game.name, url: game.imageUrl }]);
      updateDoc(userUid, {
        wishlist: arrayUnion({ name: game.name, url: game.imageUrl }),
      });
    } else if (wishlistAdded) {
      setWishlistAdded(false)
      setWishlistButtonText('Add to favourites')
      const updatedWishlist = wishlist.filter((wishlistGame) => wishlistGame.name !== game.name)
      setWishlist(updatedWishlist)
      updateDoc(userUid, { wishlist: updatedWishlist })
    }
  }

  
  function handleOwnedButton(game) {
    if (!ownedAdded) {
      setOwnedAdded(true)
      setOwnedButtonText('You own this game!')
      setOwned([...owned, { name: game.name, url: game.imageUrl }]);
      updateDoc(userUid, {
        owned: arrayUnion({ name: game.name, url: game.imageUrl }),
      });
    } else if (ownedAdded) {
      setOwnedAdded(false)
      setOwnedButtonText('Add to Owned Games')
      const updatedOwned = owned.filter((ownedGame) => ownedGame.name !== game.name)
      setOwned(updatedOwned)
      updateDoc(userUid, { owned: updatedOwned})
      
    }
  }

  function handleOnPress() {
    setModalVisible(true);
    setEventBeingCreated(true)
  }

  return (
    <Layout style={styles.container} level="4">
        <ScrollView showsVerticalScrollIndicator={false}>
     
        {isLoading ? (
          <Layout style={styles.loadingContainer}>
            <Spinner size="giant" />
          </Layout>
        ) : (
          <KeyboardAvoidingView>
            <Layout style={styles.gameInfo}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
              <Text category="h5" style={styles.name}>
                {name}
              </Text>
              <Text
                appearance="hint"
                style={styles.details}
              >{`${minPlayers} - ${maxPlayers} players, ${playingTime} min play time`}</Text>

              <Layout style={styles.buttonContainer}>
                <Button
                  onPress={() => {
                    handleOwnedButton(game);
                  }}
                  style={styles.button}
                  status={ !ownedAdded ? "primary" : "success"}
                >{ownedButtonText}</Button>

                <Button
                  onPress={() => {
                    handleWishlistButton(game);
                  }}
                  style={styles.button}
                  status={ !wishlistAdded ? "primary" : "success" }
                >{wishlistButtonText}</Button>
                <Button
                  style={styles.button}
                  status="primary"
                  onPress={() => handleOnPress()}
                >
                  Create event
                </Button>
              </Layout>

              <Modal
                visible={isModalVisible}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => setModalVisible(false)}
                animationType="fade"
              >
                <CreateEvent
                  game={game}
                  setEventCreated={setEventCreated}
                  setEventBeingCreated={setModalVisible}
                />
              </Modal>

              {eventCreated && <Text>Your event has been created!</Text>}
            </Layout>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  gameInfo: {
    minWidth: "90%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 8,
    marginTop: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
  gameInfo: {
    minWidth: "90%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  name: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  details: {
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  button: {
    marginVertical: 4,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  notFound: {
    alignSelf: "center",
    justifySelf: "center",
    width: 225,
    height: 225,
  },
  notFoundContainer: {
    flex: 1,
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
});

export default GameScreen;
