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
  const [userGoing, setUserGoing] = useState(false)
  const [userWaitlisted, setUserWaitlisted] = useState(false)

  const notFoundAnimation = useRef(null);

  const { user, events, setEvents } = useContext(UserContext);

  const { eventId } = route.params;

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef)
    .then((result) => {
      const userData = result.data();
      setEvents(userData.events);
      const goingCheck = events.some((event) => event.eventID === eventId);
      setUserGoing(goingCheck);
      const docRef = doc(db, "events", eventId);
      return getDoc(docRef)
    })
    .then((res) => {
      const result = res.data();
      setEventData(result);
      setFormattedDate(new Date(result.dateTime).toUTCString());
      setFormattedDeadline(new Date(result.eventDeadline).toUTCString());
      if (result.attendees.length >= result.maxPlayers) {
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

  const { eventName, dateTime, imageUrl, gameName, attendees, waitlist } = eventData
  const userRef = doc(db, "users", user.uid)
  const eventRef = doc(db, "events", eventId);

  function handleJoinLeaveButton(user) {
    if (!userGoing) {
      setUserGoing(true)
      setEvents([...events, {eventName, dateAndTime: dateTime, image: imageUrl, gameName, eventID: eventId }])
      updateDoc(eventRef, {
        attendees: arrayUnion({ username: user.displayName, avatarUrl: user.photoURL }),
      })
      .then(() => {
        updateDoc(userRef, {
          events: arrayUnion({eventName, dateAndTime: dateTime, image: imageUrl, gameName, eventID: eventId })
        })
      })
    } else if (userGoing) {
      setUserGoing(false)
      const updatedEvents = events.filter((event) => event.eventID !== eventId)
      setEvents(updatedEvents)
      const updatedAttendees = attendees.filter((attendee) => attendee.username !== user.displayName)
      updateDoc(eventRef, { attendees: updatedAttendees })
      .then(() => {
        updateDoc(userRef, { events: updatedEvents })
      })
    }
  }

  function handleWaitlistButton(user) {
    if(!userWaitlisted) {
      setUserWaitlisted(true)
      updateDoc(eventRef, {
        waitlist: arrayUnion({ username: user.displayName, avatarUrl: user.photoURL }),
      });
    } else if (userWaitlisted) {
      setUserWaitlisted(false)
      const updatedWaitlist = waitlist.filter((waitlister) => waitlister.username !== user.displayName)
      updateDoc(eventRef, { waitlist: updatedWaitlist })
    }
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

  const AttendanceButtons = () => {
    if (isPast) {
      return (
        <Text appearance="default" style={styles.details}>
          Too late buddy!
        </Text>)
    } else if (isFull && !userWaitlisted) {
      return (
        <>
          <Text appearance="default" style={styles.details}>
            This event is full! Join the waitlist by clicking below:{" "}
          </Text>
          <Button
            onPress={() => {
              handleWaitlistButton(user);
            }}
            style={styles.button}
            status="primary"
            >
            Join the waitlist
          </Button>
        </>
      )
    } else if (isFull && userWaitlisted) {
      return (
        <>
          <Text appearance="default" style={styles.details}>
            You are currently on the waitlist for this event.
          </Text>
          <Button
            onPress={() => {
              handleWaitlistButton(user);
            }}
            style={styles.button}
            status="danger"
            >
            Remove me from the waitlist
          </Button>
        </>
      )
    } else if (userGoing) {
      return (
        <Button
          onPress={() => {
            handleJoinLeaveButton(user);
          }}
          style={styles.button}
          status="danger"
        >
          Cancel attendance
        </Button>
      )
    } else {
      return (
        <Button
          onPress={() => {
            handleJoinLeaveButton(user);
          }}
          style={styles.button}
          status="primary"
        >
          Join Event
        </Button>
      )
    }
  }

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
            <Text appearance="default" style={styles.details}>
              {eventData.organiserUsername}'s {eventData.gameName} Event!
            </Text>
            <Text appearance="hint" style={styles.details}>
              {formattedDate}
            </Text>
            <Text appearance="hint" style={styles.details}>
              Sign up by: {formattedDeadline}
            </Text>
            <Layout style={styles.buttonContainer}>
              <AttendanceButtons />
              {/* {isPast && (
                <Text appearance="hint" style={styles.details}>
                  Too late buddy!
                </Text>
              )} */}
              
              {/* {isFull && !userGoing && (
                <>
                  <Text appearance="hint" style={styles.details}>
                    This event is full! Join the waitlist by clicking below:{" "}
                  </Text>
                  <Button
                    onPress={() => {
                      handleWaitlistButton(user);
                    }}
                    style={styles.button}
                    status={ !userWaitlisted ? "primary" : "danger"}
                  >
                    Join Waitlist
                  </Button>
                </>
              )} */}
              {/* {userGoing && (
                <Button
                onPress={() => {
                  handleJoinLeaveButton(user);
                }}
                style={styles.button}
                status={ !userGoing ? "primary" : "danger" }
              >
                {joinButtonText}
              </Button>
              )} */}
              {/* {!isPast && !isFull && !userGoing (
                <Button
                  onPress={() => {
                    handleJoinLeaveButton(user);
                  }}
                  style={styles.button}
                  status={ !userGoing ? "primary" : "danger" }
                >
                  {joinButtonText} */}
                {/* </Button>
              )} */}
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
