import * as React from "react";
import { View, StyleSheet } from "react-native";
import AskRow from "./AskRow";
import _ from "lodash";
import BidRow from "./BidRow";
import { OrderBook } from "@/store/appSlice";

interface OrderBookViewProps {
  book: OrderBook;
}

const OrderBookView = (props: OrderBookViewProps) => {
  const { book } = props;
  const maxBids = _.max(Object.values(book.bids)) || 0;
  const maxAsks = _.min(Object.values(book.asks)) || 0;
  const maxAskAndBid = Math.max(maxBids, Math.abs(maxAsks));
  // console.log(maxAskAndBid);
  return (
    <View style={styles.container}>
      <View style={styles.bids}>
        {Object.entries(book.bids).map((e) => (
          <BidRow
            key={e[0]}
            price={parseFloat(e[0])}
            amount={Math.abs(e[1])}
            maxAmount={maxAskAndBid}
          />
        ))}
      </View>
      <View style={styles.asks}>
        {Object.entries(book.asks).map((e) => (
          <AskRow
            key={e[0]}
            price={parseFloat(e[0])}
            amount={Math.abs(e[1])}
            maxAmount={maxAskAndBid}
          />
        ))}
      </View>
    </View>
  );
};

export default OrderBookView;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  asks: {
    flex: 1,
  },
  bids: {
    flex: 1,
  },
});
