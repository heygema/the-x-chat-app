import * as React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

import { Text, View } from "../components/Themed";
import { gql, useQuery } from "@apollo/client";

export default function TabOneScreen() {
  const { data, error, loading } = useQuery(gql`
    query {
      users {
        name
        email
      }
    }
  `);

  const userList: Array<{ label: string; value: string }> = (
    (data && data.users) ||
    []
  ).map(({ email }: { email: string; name: string }) => ({
    label: email,
    value: email
  }));

  const [showDropDown, setShowDropDown] = React.useState(true);

  const [user, setUser] = React.useState("");

  React.useEffect(() => {
    if (!user) {
      setUser(userList[0]?.value || "");
    }

    return () => {};
  }, [data]);

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
      <Text style={styles.title}>{"Pick a user"}</Text>
      <DropDown
        label={"User"}
        mode={"outlined"}
        value={user}
        setValue={setUser}
        list={userList}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        inputProps={{
          right: <TextInput.Icon name={"menu-down"} />
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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
