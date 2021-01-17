import * as React from "react";
import { StyleSheet } from "react-native";
import { io } from "socket.io-client";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

let socket = io("ws://localhost:4000");

export default function TabOneScreen() {
  const [message, setMessage] = React.useState('')


  React.useEffect(() => {
    socket.emit("join-friend-room", 10);

    socket.on('message', (message: string) => {
      setMessage(message);
    })


    return () => {
      socket.disconnect();
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
