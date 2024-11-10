import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

interface HeaderProps {
  title: string;
}

const Header = (props: HeaderProps) => {
  const { title } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 45,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
});
