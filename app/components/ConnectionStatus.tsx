import { ConnectionState } from "@/store/appSlice";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

interface ConnectionStatusProps {
  connection: ConnectionState;
}

const ConnectionStatus = (props: ConnectionStatusProps) => {
  const { connection } = props;

  const connectionText = (connection: ConnectionState) => {
    switch (connection) {
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Connected.";

      default:
        return "Disconnected.";
    }
  };
  return (
    <View style={styles.container}>
      <Text>{connectionText(connection)}</Text>
    </View>
  );
};

export default ConnectionStatus;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    alignItems: "center",
  },
});
