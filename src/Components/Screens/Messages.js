import { StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection, addDoc, getDocs, query, where, doc, getDoc, onSnapshot, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

import {
  Icon,
  Button,
  List,
  Text,
  Divider,
  Layout,
  Autocomplete,
  AutocompleteItem,
  Spinner,
} from "@ui-kitten/components";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../Context/UserContext";

const Messages = () => {
  const { user } = useContext(UserContext);
  const [messageThreads, setMessageThreads] = useState([]);
  const [autoCompleteData, setAutoCompleteData] = useState(["loading..."]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigation();
  const [lastMessages, setLastMessages] = useState([]);

  const handleSearchChange = async (newTerm) => {
    setSearchTerm(newTerm.toLowerCase());

    if (searchTerm !== "" && searchTerm.length <= 10) {
      const newAutoCompleteData = await fetchUsernames(newTerm);
    } else {
      setAutoCompleteData(["No Users Found"]);
    }
  };

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("username", ">=", searchTerm));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No users found");
      return;
    } else {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      const threadId = await createMessageThread(user.uid, userId);

      if (threadId) {
        nav.navigate("Chat", { threadId: threadId, name: userDoc.data().username });
      }
    }
  };

  const fetchUsernames = async (searchTerm) => {
    const q = query(collection(db, "users"), where("username", ">=", searchTerm));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No users found");
      return;
    } else {
      const usernames = querySnapshot.docs.map((doc) => {
        if (doc.data().username !== user.username) {
          return doc.data().username.toLowerCase();
        }
      });
      setAutoCompleteData(usernames);
    }
  };

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

    const unsubscribe = onSnapshot(
      threadsQuery,
      async (querySnapshot) => {
        const threads = [];

        for (const document of querySnapshot.docs) {
          const data = document.data();
          data.id = document.id;
          const participants = data.participants;

          const otherParticipants = participants.filter((participantId) => {
            return participantId !== user.uid;
          });

          data.participants = await Promise.all(
            otherParticipants.map(async (participantId) => {
              const userRef = doc(db, "users", participantId);
              const userData = await getDoc(userRef);
              return userData.data();
            })
          );

          // Get the last message in the thread
          const threadRef = collection(db, "messageThreads", data.id, "messages");
          const q = query(threadRef, orderBy("timestamp", "desc"), limit(1));

          await onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => doc.data());
            data.lastMessage = msgs[0] ? msgs[0].content : "No Messages";
          });

          threads.push(data);
        }

        setMessageThreads(threads);
      },
      (error) => {
        console.error("Error fetching user threads:", error);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    setIsLoading(true);
    let unsubscribe;
    const createThreads = async () => {
      if (!user) return;
      unsubscribe = await getUserThreads();
    };

    createThreads();
    setIsLoading(false);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, setMessageThreads]);

  const renderItem = ({ item, index }) => {
    const avatarUrl = item.participants[0].avatarUrl;

    return (
      <Button
        appearance="ghost"
        key={index}
        style={styles.card}
        onPress={() => {
          nav.navigate("Chat", { threadId: item.id, name: item.participants[0].username });
        }}
      >
        {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.img} />}
        {!avatarUrl && <Icon name="person-outline" fill="white" style={styles.img} />}
        <Layout style={styles.content}>
          <Text style={styles.username}>{item.participants[0].username}</Text>
          <Text style={styles.message}>{item.lastMessage}</Text>
        </Layout>
      </Button>
    );
  };

  if (isLoading) {
    return (
      <Layout style={styles.loading}>
        <Spinner size="giant" />
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Autocomplete
          style={styles.autocomplete}
          placeholder="Search User..."
          value={searchTerm}
          onSelect={(index) => setSearchTerm(autoCompleteData[index])}
          onChangeText={handleSearchChange}
          size="large"
          autoCapitalize="none"
        >
          {autoCompleteData.map((item, index) => (
            <AutocompleteItem key={index} title={item} style={styles.autoItem} />
          ))}
        </Autocomplete>
        <Button appearance="outline" onPress={handleSearch} style={styles.button}>
          Search
        </Button>
        <List style={styles.container} data={messageThreads} renderItem={renderItem} ItemSeparatorComponent={Divider} />
      </Layout>
    );
  }
};

const styles = StyleSheet.create({
  loading: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  autocomplete: {
    minWidth: "100%",
    alignSelf: "center",
  },
  container: {
    paddingTop: StatusBar.currentHeight || 0,
    height: "100%",
  },
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 95,
  },
  content: {
    backgroundColor: "transparent",
    padding: 10,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    width: "100%",
  },
  message: {
    fontSize: 16,
    maxHeight: 50,
    overflow: "hidden",
  },
});

export default Messages;
