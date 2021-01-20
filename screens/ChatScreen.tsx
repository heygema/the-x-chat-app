import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";

import { Text, View } from "../components/Themed";
import { socket } from "../helpers/socket";
import { useUserStore } from "../helpers/store";

type MessageItem = {
  content: string;
  id: string;
  sender: {
    email: string;
  };
  createAt: string;
};

function ChatBubble({ sender, content }: MessageItem) {
  const email = useUserStore((state) => state.user as string);

  let isMe = sender.email === email;

  return (
    <View
      style={[
        styles.chatBubble,
        isMe && { backgroundColor: "#E6E5EA", alignSelf: "flex-end" }
      ]}
    >
      <Text lightColor={isMe ? "#000" : "#FFF"}>{content}</Text>
    </View>
  );
}

export default function ChatScreen({
  route: {
    params: { roomId }
  }
}: {
  route: { params: { roomId: string } };
}) {
  const email = useUserStore((state) => state.user as string);
  const [msg, setMsg] = React.useState("");
  let scrollViewRef = React.useRef<any>();

  const { data, refetch } = useQuery(
    gql`
      query Messages($roomId: String!) {
        messages(roomId: $roomId) {
          id
          content
          sender {
            email
          }
        }
      }
    `,
    {
      variables: {
        roomId
      }
    }
  );

  React.useEffect(() => {
    refetch();
    return () => {};
  }, [data]);

  React.useEffect(() => {
    socket.emit("join-friend-room", roomId);
    socket.on("message-from-server", (_: any) => {
      refetch();
    });

    return () => {
      socket.off();
    };
  }, [socket.id]);

  const sendMsg = () => {
    if (msg !== "") {
      socket.emit("message-from-client", {
        email,
        content: msg,
        roomId
      });
    }
    setMsg("");
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef &&
              scrollViewRef?.current?.scrollToEnd({ animated: true });
          }}
          style={styles.scrollView}
        >
          {((data && data.messages) || []).map(
            (chat: MessageItem, index: number) => (
              <ChatBubble {...chat} key={String(index)} />
            )
          )}
        </ScrollView>
      </View>
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
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 110
  }
});
