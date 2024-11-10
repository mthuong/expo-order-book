import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import VolumeBar from "./VolumeBar";

interface BidRowProps {
  amount: number;
  price: number;
  maxAmount: number;
}

const BidRow = (props: BidRowProps) => {
  const { amount, price, maxAmount } = props;
  const percent = (Math.abs(amount) / maxAmount) * 100;
  return (
    <View style={styles.container}>
      <VolumeBar percent={percent} color="#4CAF50" type="bid" />
      <Text>{amount.toFixed(3)}</Text>
      <Text>{price.toLocaleString("en-US")}</Text>
    </View>
  );
};

export default BidRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});
