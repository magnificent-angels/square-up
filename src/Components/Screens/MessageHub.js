import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";

const MessageHub = () => {
  const { user } = useContext(UserContext);
  const [messageThreads, setMessageThreads] = useState(null);

  console.log(user.uid); // need this later

  useEffect(() => {
    getDocs(collection(db, "messageThreads")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setMessageThreads(doc.data());
      });
    });
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>MessageHub</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 0,
  },
});

export default MessageHub;
