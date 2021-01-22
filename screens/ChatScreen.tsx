import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import * as React from "react";
import { ScrollView, TextInput, StyleSheet, Button } from "react-native";

import { Text, View } from "../components/Themed";
import { socket } from "../helpers/socket";
import { useUserStore } from "../helpers/store";

type MessageItem = {
  content: string;
  id: string;
  sender: {
    email: string;
  };
  createdAt: string;
};

function ChatBubble({ sender, content, createdAt }: MessageItem) {
  let email = useUserStore((state) => state.user as string);
  let time = moment(createdAt).format('hh:mm')

  let isMe = sender.email === email;

  return (
    <View style={[styles.chatBubble, isMe && styles.meChatBubble]}>
      <Text lightColor={isMe ? "#FFF" : "#000"}>{content}</Text>
      <Text lightColor={isMe ? "#FFF" : "#000"}>{time}</Text>
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
    scrollViewRef && scrollViewRef?.current?.scrollToEnd({ animated: false });
    refetch();
    return () => {};
  }, [data]);

  React.useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }
    socket.emit("join-friend-room", roomId);
    socket.on("message-from-server", () => {
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
          <Button title="SEND" color="#FFFFFF" onPress={sendMsg} />
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
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    shadowRadius: 100,
    shadowOffset: {
      width: 10,
      height: 100
    },
    shadowColor: "#333"
  },
  buttonContainer: {
    backgroundColor: "#00D549",
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  chatBubble: {
    maxWidth: 200,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#E6E5EA"
  },
  meChatBubble: {
    backgroundColor: "#00D549",
    alignSelf: "flex-end"
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 110
  }
});
