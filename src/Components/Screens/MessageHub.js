import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";

const MessageHub = () => {
  const { user } = useContext(UserContext);
  const [messageThreads, setMessageThreads] = useState([]);

  useEffect(() => {
    const messagesListener = onSnapshot(
      query(collection(db, "messageThreads"), where("participants", "array-contains", user.uid)),
      (snapshot) => {
        const threads = snapshot.docs.map((doc) => doc.data());
        setMessageThreads(threads);
      }
    );
    return () => messagesListener();
  }, [user]);

  if (messageThreads) {
    return <SafeAreaView style={styles.container}></SafeAreaView>;
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 0,
  },
});

export default MessageHub;
