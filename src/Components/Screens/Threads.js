import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

import { Icon, Button, List, Text, Divider, Layout } from "@ui-kitten/components";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";

const user2 = "Kuv6ZONHJLNl0a0InHyK6wIM6972";
const user3 = "qimh40TUGNOA5sf7RR6fiCXtMC63";

const Threads = () => {
  const { user } = useContext(UserContext);
  const [messageThreads, setMessageThreads] = useState([]);
  const nav = useNavigation();

  const createMessageThread = async (user1Id, user2Id) => {
    // Check if a thread already exists between the two users
    const queryUser1 = query(collection(db, "messageThreads"), where("participants", "array-contains", user1Id));

    const queryUser2 = query(collection(db, "messageThreads"), where("participants", "array-contains", user2Id));

    try {
      const [resultUser1, resultUser2] = await Promise.all([getDocs(queryUser1), getDocs(queryUser2)]);

      // Check for an intersection of threads
      const commonThreads = resultUser1.docs.filter((doc) => resultUser2.docs.some((d) => d.id === doc.id));

      if (commonThreads.length > 0) {
        const existingThread = commonThreads[0];
        console.log("Thread already exists with ID:", existingThread.id);
        return existingThread.id;
      }

      // If no existing thread, create a new one
      const newThreadDocRef = await addDoc(collection(db, "messageThreads"), {
        participants: [user1Id, user2Id],
        createdAt: new Date(),
      });

      console.log("Message thread created with ID:", newThreadDocRef.id);
      return newThreadDocRef.id;
    } catch (error) {
      console.error("Error creating or checking message thread:", error);
      return null;
    }
  };

  const getUserThreads = async () => {
    const threadsQuery = query(collection(db, "messageThreads"), where("participants", "array-contains", user.uid));

    try {
      const querySnapshot = await getDocs(threadsQuery);

      querySnapshot.forEach(async (document) => {
        const data = document.data();
        data.id = document.id;
        setMessageThreads([]);
        const participants = data.participants;

        const otherParticipants = participants.filter((participantId) => {
          return participantId !== user.uid;
        });

        data.participants = [];

        otherParticipants.forEach(async (participantId) => {
          const userRef = doc(db, "users", participantId);
          const userData = await getDoc(userRef);

          data.participants.push(userData.data());

          setMessageThreads((prev) => [...prev, data]);
        });
      });
    } catch (error) {
      console.error("Error fetching user threads:", error);
      return [];
    }
  };

  useEffect(() => {
    const createThreads = async () => {
      if (!user) return;
      const newThread = await createMessageThread(user.uid, user2);
      const newThread2 = await createMessageThread(user.uid, user3);
      await getUserThreads();
    };

    createThreads();
  }, [user]);

  const renderIcon = (props) => {
    return <Icon {...props} name="person-outline" />;
  };

  const renderItem = ({ item, index }) => (
    <Button
      key={index}
      style={styles.card}
      accessoryLeft={renderIcon}
      appearance="ghost"
      onPress={() => {
        nav.navigate("Messages", { threadId: item.id });
      }}
    >
      <Text>{item.participants[0].username}</Text>
    </Button>
  );

  if (messageThreads)
    return (
      <Layout>
        <List style={styles.container} data={messageThreads} renderItem={renderItem} ItemSeparatorComponent={Divider} />
      </Layout>
    );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 0,
    height: "100%",
  },
  card: {
    borderRadius: 0,
    justifyContent: "left",
  },
});

export default Threads;
