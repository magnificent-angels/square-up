import React, { useState, useEffect, useContext, useRef } from "react";
import { Image, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Layout, Text, Button, Spinner, Modal } from "@ui-kitten/components";
import LottieView from "lottie-react-native";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { UserContext } from "../Context/UserContext";

const Error = ({ msg }) => <Text category="h6">{msg}</Text>;

function EventDetails({ route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [eventData, setEventData] = useState({});
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedDeadline, setFormattedDeadline] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const notFoundAnimation = useRef(null);
  const { user } = useContext(UserContext);

  const { eventId } = route.params;

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    const docRef = doc(db, "events", eventId);
    getDoc(docRef)
      .then((res) => {
        const result = res.data();
        setEventData(result);
        setFormattedDate(new Date(result.dateTime).toUTCString());
        setFormattedDeadline(new Date(result.eventDeadline).toUTCString());
        if (result.attendees.length + 1 >= result.maxPlayers) {
          setIsFull(true);
        }
        const checkDate = new Date(result.dateTime);
        const deadlineDate = new Date(result.eventDeadline);
        const currentDate = new Date();
        if (checkDate < currentDate || deadlineDate < currentDate) {
          setIsPast(true);
        }
      })
      .then(() => {
        setIsLoading(false);
      });
  }, []);

  function joinEvent(user) {
    const eventRef = doc(db, "events", eventId);
    updateDoc(eventRef, {
      attendees: arrayUnion({ username: user.displayName, avatarUrl: user.photoURL }),
    }).then(() => {
      const userRef = doc(db, "users", user.uid)
      updateDoc(userRef, {
        events: arrayUnion({eventName: eventData.eventName, dateAndTime: eventData.dateTime, image: eventData.imageUrl, gameName: eventData.gameName, eventID: eventId })
      })
    })
  }

  function joinWaitlist(user) {
    const eventRef = doc(db, "events", eventId);
    updateDoc(eventRef, {
      waitlist: arrayUnion({ username: user.displayName, avatarUrl: user.photoURL }),
    });
  }


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
        <Error msg="Sorry, we couldn’t retrieve that event" />
      </Layout>
    );

  return (
    <Layout style={styles.container}>
      {isLoading ? (
        <Layout style={styles.loadingContainer}>
          <Spinner size="giant" />
        </Layout>
      ) : (
        <KeyboardAvoidingView>
          <Layout style={styles.eventInfo}>
            <Image source={{ uri: eventData.imageUrl }} style={styles.image} />
            <Text category="h5" style={styles.name}>
              {eventData.eventName}
            </Text>
            <Text appearance="hint" style={styles.details}>
              {eventData.organiserUsername}'s {eventData.gameName} Event!
            </Text>
            <Text appearance="hint" style={styles.details}>
              {formattedDate}
            </Text>
            <Text appearance="hint" style={styles.details}>
              Sign up by: {formattedDeadline}
            </Text>
            <Layout style={styles.buttonContainer}>
              {isPast && (
                <Text appearance="hint" style={styles.details}>
                  Too late buddy!
                </Text>
              )}
              {isFull && (
                <>
                  <Text appearance="hint" style={styles.details}>
                    This event is full! Join the waitlist by clicking below:{" "}
                  </Text>
                  <Button
                    onPress={() => {
                      joinWaitlist(user);
                    }}
                    style={styles.button}
                    status="info"
                  >
                    Join Waitlist
                  </Button>
                </>
              )}
              {!isPast && !isFull && (
                <Button
                  onPress={() => {
                    joinEvent(user);
                  }}
                  style={styles.button}
                  status="info"
                >
                  Join Event
                </Button>
              )}
            </Layout>
          </Layout>
        </KeyboardAvoidingView>
      )}
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
  eventInfo: {
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

export default EventDetails;
