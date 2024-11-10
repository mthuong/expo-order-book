import * as React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = (props: ViewProps) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ height: top }} />
      {props.children}
      <View style={{ height: bottom }} />
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
