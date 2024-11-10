import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import VolumeBar from "./VolumeBar";

interface AskRowProps {
  amount: number;
  price: number;
  maxAmount: number;
}

const AskRow = (props: AskRowProps) => {
  const { amount, price, maxAmount } = props;
  const percent = (Math.abs(amount) / maxAmount) * 100;
  return (
    <View style={styles.container}>
      <VolumeBar percent={percent} color="#FF5722" type="ask" />
      <Text>{price.toLocaleString("en-US")}</Text>
      <Text>{amount.toFixed(3)}</Text>
    </View>
  );
};

export default AskRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});
