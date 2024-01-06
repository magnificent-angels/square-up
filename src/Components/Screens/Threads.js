import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection, addDoc, getDocs, query, where, doc, getDoc, onSnapshot } from "firebase/firestore";
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

const Threads = () => {
  const { user } = useContext(UserContext);
  const [messageThreads, setMessageThreads] = useState([]);
  const [autoCompleteData, setAutoCompleteData] = useState(["loading..."]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigation();

  const handleSearchChange = async (newTerm) => {
    setSearchTerm(newTerm);

    if (searchTerm !== "" && searchTerm.length <= 10) {
      const newAutoCompleteData = await fetchUsernames(newTerm);
    } else {
      setAutoCompleteData(["No Users Found"]);
    }
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
        nav.navigate("Messages", { threadId });
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
        return doc.data().username;
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
      (querySnapshot) => {
        const threads = [];

        querySnapshot.forEach((document) => {
          const data = document.data();
          data.id = document.id;
          const participants = data.participants;

          const otherParticipants = participants.filter((participantId) => {
            return participantId !== user.uid;
          });

          data.participants = [];

          Promise.all(
            otherParticipants.map(async (participantId) => {
              const userRef = doc(db, "users", participantId);
              const userData = await getDoc(userRef);

              data.participants.push(userData.data());

              return data;
            })
          ).then((updatedThreads) => {
            threads.push(...updatedThreads);
            setMessageThreads(threads); // Move the setMessageThreads call here
          });
        });
      },
      (error) => {
        console.error("Error fetching user threads:", error);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    setIsLoading(true);
    const createThreads = async () => {
      if (!user) return;
      await getUserThreads();
    };

    createThreads();
    setIsLoading(false);
  }, [user, setMessageThreads]);

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
        >
          {autoCompleteData.map((item, index) => (
            <AutocompleteItem key={index} title={item} style={styles.autoItem} />
          ))}
        </Autocomplete>
        <Button appearance="ghost" onPress={handleSearch} style={styles.button}>
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
    marginTop: 10,
  },
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
