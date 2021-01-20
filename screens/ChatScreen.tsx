import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Title, TextInput, Paragraph, Button } from "react-native-paper";

import { Text, View } from "../components/Themed";
import { useUserStore } from "../helpers/store";

const chats = [
  {
    id: 1,
    sender: {
      email: "bobo@test.com"
    },
    content: "Lorem Ipsum"
  },
  {
    id: 2,
    sender: {
      email: "bibi@test.com"
    },
    content: "Lorem Ipsum"
  },
  {
    id: 2,
    sender: {
      email: "bibi@test.com"
    },
    content: "Lorem Ipsum"
  }
];

function ChatBubble({
  sender,
  content
}: {
  id: number;
  sender: {
    email: string;
  };
  content: string;
}) {
  const email = useUserStore((state) => state.user as string);

  let isMe = sender.email === email;

  return (
    <View style={[styles.chatBubble, isMe && { backgroundColor: "#E6E5EA", alignSelf: 'flex-end' }]}>
      <Text lightColor={isMe ? "#000" : "#FFF"}>{content}</Text>
    </View>
  );
}

export default function ChatScreen({
  route: { params }
}: {
  route: { params: string };
}) {
  const [msg, setMsg] = React.useState("");

  const sendMsg = () => {
    setMsg("");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          padding: 20
        }}
      >
        {chats.map((chat, index) => (
          <ChatBubble {...chat} key={String(index)} />
        ))}
      </ScrollView>
      <View style={styles.bottomBox}>
        <View style={styles.inputContainer}>
          <TextInput
            label=""
            onChangeText={setMsg}
            value={msg}
            style={{
              height: 50
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={sendMsg}>SEND</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  },
  bottomBox: { height: 50, flexDirection: "row" },
  inputContainer: { flex: 1, justifyContent: "center" },
  buttonContainer: {
    backgroundColor: "#000",
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  chatBubble: {
    maxWidth: 200,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#00D549"
  }
});
