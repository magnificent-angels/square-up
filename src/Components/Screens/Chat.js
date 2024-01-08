import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../Context/UserContext";
import { Layout, Text, Card, Input, Icon, Button } from "@ui-kitten/components";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import { collection, addDoc, onSnapshot, orderBy, query, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { StatusBar } from "expo-status-bar";

const Chat = (props) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const { threadId } = props.route.params;
  const scrollViewRef = useRef();
  const [otherUser, setOtherUser] = useState();

  useEffect(() => {
    const getUserInfo = async (userId) => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      return userSnap.data();
    };

    const getMessages = () => {
      const threadRef = collection(db, "messageThreads", threadId, "messages");
      const q = query(threadRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const msgs = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();

            if (data.senderId !== user.uid) {
              const oUser = await getUserInfo(data.senderId);
              setOtherUser(oUser);
            }

            return data;
          })
        );
        setMessages(msgs);
      });

      return () => unsubscribe();
    };

    getMessages();
  }, [threadId]);

  const sendMessageToThread = async (threadId, senderId, content) => {
    const threadRef = collection(db, "messageThreads", threadId, "messages");

    setMessages((prevMessages) => [...prevMessages, { senderId, content, timestamp: new Date() }]);

    try {
      await addDoc(threadRef, {
        senderId,
        content,
        timestamp: new Date(),
      });

      console.log("Message sent to thread:", threadId);
      scrollViewRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message to thread:", error);
    }
  };

  const renderIcon = (props) => <Icon {...props} name="paper-plane-outline" />;

  return (
    <Layout style={styles.section}>
      <ScrollView style={styles.msgs} ref={scrollViewRef}>
        {messages.map((message, index) => {
          const timestamp = message.timestamp.toDate();
          const timeString = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const dateString = timestamp.toLocaleDateString([], { year: "2-digit", month: "2-digit", day: "2-digit" });

          return (
            <Card key={index} style={message.senderId === user.uid ? styles.sent : styles.received}>
              <Image
                source={message.senderId === user.uid ? { uri: user.photoURL } : { uri: otherUser.avatarUrl }}
                style={{ height: 50, width: 50, borderRadius: 50 }}
              />
              <Text>{message.content}</Text>
              <Text style={styles.dateTime}>
                {timeString}, {dateString}
              </Text>
            </Card>
          );
        })}
      </ScrollView>
      <View style={styles.inputView}>
        <Input
          style={styles.input}
          placeholder="Message..."
          value={content}
          onChangeText={(text) => setContent(text)}
          onSubmitEditing={() => {
            sendMessageToThread(threadId, user.uid, content);
            setContent("");
          }}
        />
        <Button
          appearance="outline"
          accessoryLeft={renderIcon}
          style={styles.send}
          onPress={() => {
            sendMessageToThread(threadId, user.uid, content);
            setContent("");
          }}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 0,
    height: "100%",
  },
  section: {
    padding: 5,
    justifyContent: "space-between",
    height: "100%",
    flex: 1,
  },
  sent: {
    width: "85%",
    alignSelf: "flex-end",
    backgroundColor: "rgba(51, 255, 102, 0.48)",
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "gray",
  },
  received: {
    width: "85%",
    alignSelf: "flex-start",
    backgroundColor: "rgba(51, 102, 255, 0.48)",
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "gray",
  },
  inputView: {
    width: "100%",
    backgroundColor: "#222B45",
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    height: "10%",
  },
  input: {
    width: "86%",
    height: 50,
    borderTopWidth: 1,
    borderTopColor: "gray",
  },
  send: {
    width: "10%",
    height: 40,
  },
  dateTime: {
    fontSize: 10,
    textAlign: "right",
    color: "gray",
  },
});

export default Chat;
