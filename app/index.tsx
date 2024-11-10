import { Button, Container, Header } from "@/components";
import { useAppSelector } from "@/store/selectors";
import * as React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import ConnectionStatus from "./components/ConnectionStatus";
import OrderBookView from "./components/OrderBookView";
import { Ionicons } from "@expo/vector-icons";
import spacing from "@/constants/spacing";
import {
  connectWs,
  decreasePrecision,
  disconnectWs,
  increasePrecision,
  Precision,
} from "@/store/appSlice";
import { globalDispatch } from "@/store/dispatcher";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { Colors } from "@/constants/Colors";

interface HomeProps {}

const Home = (props: HomeProps) => {
  const dispatch = useDispatch();

  const connectionState = useAppSelector((state) => state.app.connectionState);
  const book = useAppSelector((state) => state.app.book);
  const precision = useAppSelector((state) => state.app.precision);
  const canDecreasePrecision = precision !== Precision.P0;
  const canIncreasePrecision = precision !== Precision.P4;

  const connect = useCallback(() => {
    dispatch(
      connectWs({
        prec: precision,
        len: 25,
        symbol: "tBTCUSD",
        freq: "F1",
      })
    );
  }, [dispatch, precision]);

  const disconnect = useCallback(() => {
    dispatch(disconnectWs());
  }, [dispatch]);

  const handleDecreasePrecision = useCallback(() => {
    globalDispatch(decreasePrecision());
    connect();
  }, [connect]);

  const handleIncreasePrecision = useCallback(() => {
    globalDispatch(increasePrecision());
    connect();
  }, [connect]);

  return (
    <Container>
      <Header title='Home'></Header>
      <View style={styles.actions}>
        <Button
          title='Connect'
          onPress={() => {
            connect();
          }}
          style={styles.connect}
        ></Button>
        <Button
          title='Disconnect'
          onPress={() => {
            disconnect();
          }}
          style={styles.disconnect}
        ></Button>
      </View>
      <ConnectionStatus connection={connectionState} />
      <View style={styles.precision}>
        <TouchableOpacity
          disabled={!canDecreasePrecision}
          onPress={handleDecreasePrecision}
          style={!canDecreasePrecision && styles.iconDisable}
        >
          <Ionicons style={styles.icon} name='remove-outline'></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canIncreasePrecision}
          onPress={() => {
            handleIncreasePrecision();
          }}
          style={!canIncreasePrecision && styles.iconDisable}
        >
          <Ionicons style={styles.icon} name='add'></Ionicons>
        </TouchableOpacity>
      </View>
      {connectionState === "connected" && (
        <ScrollView>
          <OrderBookView book={book} />
        </ScrollView>
      )}
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  connect: {
    backgroundColor: Colors.light.buyColor,
  },
  disconnect: {
    backgroundColor: Colors.light.sellColor,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  precision: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: spacing.x2,
  },
  icon: {
    fontSize: 32,
  },
  iconDisable: {
    opacity: 0.2,
  },
});
