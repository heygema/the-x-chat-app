import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

import { Text, View } from "../components/Themed";
import { useUserStore } from "../helpers/store";

const FriendCard = ({
  name,
  ...props
}: {
  name: string;
  [key: string]: any;
}) => (
  <Card
    style={{
      margin: 10
    }}
    {...props}
  >
    <Card.Content>
      <Title>{name}</Title>
      <Paragraph>{`Press to chat with ${name}`}</Paragraph>
    </Card.Content>
  </Card>
);

export default function TabTwoScreen() {
  const email = useUserStore((state) => state.user as string);

  const navigation = useNavigation();

  const onCardPress = (roomId: string, name: string) =>
    navigation.navigate("ChatScreen", { roomId, name });

  const { data, error, loading, refetch } = useQuery(
    gql`
      query Friends($email: String!) {
        friends(email: $email) {
          id
          users {
            name
          }
        }
      }
    `,
    {
      variables: {
        email
      }
    }
  );

  React.useEffect(() => {
    refetch();
    return () => {};
  }, [data]);

  let friendList = (data && data.friends) || [];

  if (loading || error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {loading ? "Loading ..." : error ? "Error" : "Loading..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {friendList.map(({ users: [user], id }: any, index: number) => (
          <FriendCard
            key={index}
            name={user && user.name}
            onPress={() => onCardPress(id, user.name || "")}
          />
        ))}
      </ScrollView>
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
  }
});
