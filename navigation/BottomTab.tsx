import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import {
  BottomTabBarProps,
  BottomTabBarOptions
} from "@react-navigation/bottom-tabs";

const BottomTab = (_: BottomTabBarProps<BottomTabBarOptions>) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "music", title: "Music", icon: "queue-music" },
    { key: "albums", title: "Albums", icon: "album" },
    { key: "recents", title: "Recents", icon: "history" }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: () => null,
    albums: () => null,
    recents: () => null
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomTab;
