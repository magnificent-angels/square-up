import { StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection, addDoc, getDocs, query, where, doc, getDoc, onSnapshot, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

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
  Avatar,
} from "@ui-kitten/components";

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Context/UserContext";

const Messages = () => {
  const { user } = useContext(UserContext);
  const [messageThreads, setMessageThreads] = useState([]);
  const [autoCompleteData, setAutoCompleteData] = useState(["loading..."]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigation();

  const handleSearchChange = async (newTerm) => {
    setSearchTerm(newTerm);
  };

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("username", "==", searchTerm));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No users found");
      return;
    } else {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      const threadId = await createMessageThread(user.uid, userId);

      if (threadId) {
        nav.navigate("Chat", {
          threadId: threadId,
          name: userDoc.data().username,
        });
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUsernames = async (searchTerm) => {
      const q = query(collection(db, "users"), where("username", ">=", searchTerm.toLowerCase()));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No users found");
        return;
      } else {
        const usernames = [];

        querySnapshot.docs.forEach((doc) => {
          if (doc.data().username !== user.displayName) {
            usernames.push(doc.data().username);
          }
        });

        if (isMounted) {
          setAutoCompleteData(usernames);
        }
      }
    };

    if (searchTerm !== "" && searchTerm.length <= 12) {
      fetchUsernames(searchTerm);
    } else {
      if (isMounted) {
        setAutoCompleteData(["No Users Found"]);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [searchTerm]); // This will run every time searchTerm changes

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

          onSnapshot(q, (snapshot) => {
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

  useFocusEffect(
    React.useCallback(() => {
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
    }, [user])
  );

  const renderItem = ({ item, index }) => {
    const avatarUrl = item.participants[0].avatarUrl;

    return (
      <Button
        appearance="ghost"
        key={index}
        style={styles.thread}
        onPress={() => {
          nav.navigate("Chat", {
            threadId: item.id,
            name: item.participants[0].username,
          });
        }}
      >
        {avatarUrl && <Avatar source={{ uri: avatarUrl }} style={styles.img} />}

        <Layout style={styles.content}>
          <Text style={styles.username}>{item.participants[0].username}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {item.lastMessage && item.lastMessage.length > 25
              ? `${item.lastMessage.slice(0, 25)}...`
              : item.lastMessage}
          </Text>
        </Layout>
      </Button>
    );
  };

  const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

  if (isLoading) {
    return (
      <Layout style={styles.loading}>
        <Spinner size="giant" />
      </Layout>
    );
  } else {
    return (
      <Layout style={styles.container} level="4">
        <Layout level="1" style={styles.header}>
          <Autocomplete
            style={styles.autocomplete}
            placeholder="Search User..."
            value={searchTerm}
            onSelect={(index) => setSearchTerm(autoCompleteData[index])}
            onChangeText={handleSearchChange}
            size="large"
            autoCapitalize="none"
            accessoryRight={SearchIcon}
          >
            {autoCompleteData.map((item, index) => (
              <AutocompleteItem key={index} title={item} style={styles.autoItem} level="4" />
            ))}
          </Autocomplete>
          <Button onPress={handleSearch} style={styles.button}>
            Search
          </Button>
        </Layout>
        <List data={messageThreads} renderItem={renderItem} ItemSeparatorComponent={Divider} />
      </Layout>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    height: "100%",
  },
  header: {
    paddingVertical: 20,
  },
  loading: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "40%",
    alignSelf: "center",
    marginTop: 10,
  },
  autocomplete: {
    minWidth: "100%",
    paddingHorizontal: 10,
    alignSelf: "center",
    paddingTop: 2,
    borderRadius: 0,
    backgroundColor: "#101426",
  },
  thread: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 90,
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
    overflow: "hidden",
  },
});

export default Messages;
