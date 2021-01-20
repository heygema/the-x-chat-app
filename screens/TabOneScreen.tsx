import * as React from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { gql, useQuery } from "@apollo/client";

import { Text, View } from "../components/Themed";
import { useUserStore } from "../helpers/store";

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

  const user = useUserStore((state) => state.user as string);
  const setUser = useUserStore((state) => state.selectUser as Function);

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
      <DropDownPicker
        items={userList}
        defaultValue={user}
        containerStyle={{ height: 40 }}
        style={{ backgroundColor: "#fafafa" }}
        itemStyle={{
          justifyContent: "flex-start"
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        onChangeItem={({ value }: { value: string }) => {
          setUser(value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: "bold",
    alignSelf: "center"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
