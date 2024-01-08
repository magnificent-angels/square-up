import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../Context/UserContext";
import { Layout, Text, Card, Input, Icon, Button } from "@ui-kitten/components";
import { StyleSheet, ScrollView, View } from "react-native";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { StatusBar } from "expo-status-bar";

const Chat = (props) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const { threadId } = props.route.params;
  const scrollViewRef = useRef();

  useEffect(() => {
    const getMessages = () => {
      const threadRef = collection(db, "messageThreads", threadId, "messages");
      const q = query(threadRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => doc.data());
        setMessages(msgs);
      });

      // Clean up the listener when the component unmounts
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
          return (
            <Card key={index} style={message.senderId === user.uid ? styles.sent : styles.received}>
              <Text>{message.content}</Text>
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
});

export default Chat;
