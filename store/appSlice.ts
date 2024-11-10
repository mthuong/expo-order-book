import { createAction, createSlice } from "@reduxjs/toolkit";

export type OrderBook = {
  bids: { [key: string]: number };
  asks: { [key: string]: number };
};

export type ConnectionState =
  | "connecting"
  | "disconnected"
  | "connected"
  | "failed";
export type AppState = {
  book: OrderBook;
  connectionState: ConnectionState;
  precision: Precision;
};

export enum Precision {
  P0 = "P0",
  P1 = "P1",
  P2 = "P2",
  P3 = "P3",
  P4 = "P4",
}
const precisions = [
  Precision.P0,
  Precision.P1,
  Precision.P2,
  Precision.P3,
  Precision.P4,
];

const initialState: AppState = {
  book: {
    bids: {},
    asks: {},
  },
  connectionState: "disconnected",
  precision: Precision.P0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setConnectionState: (state, action: { payload: ConnectionState }) => {
      state.connectionState = action.payload;
      if (state.connectionState === "disconnected") {
        state.book = {
          asks: {},
          bids: {},
        };
      }
    },
    handleDataReceived: (state, action) => {
      const data = action.payload;
      const book = state.book;
      data.forEach((order: any) => {
        handleOrder(book, order);
      });
    },
    decreasePrecision: (state) => {
      const currentIndex = precisions.indexOf(state.precision);
      if (currentIndex === 0) {
        return;
      }
      state.precision = precisions[currentIndex - 1];
    },
    increasePrecision: (state) => {
      const currentIndex = precisions.indexOf(state.precision);
      if (currentIndex === precisions.length - 1) {
        return;
      }
      state.precision = precisions[currentIndex + 1];
    },
  },
});

export const {
  setConnectionState,
  handleDataReceived,
  decreasePrecision,
  increasePrecision,
} = appSlice.actions;

const appReducer = appSlice.reducer;
export default appReducer;

const handleOrder = (book: OrderBook, order: number[]) => {
  // [43038, 2, 0.39187002] - [<price>, <count>, <amount>]
  const [price, count, amount] = order;

  // when count > 0 then you have to add or update the price level
  if (count > 0) {
    // 3.1 if amount > 0 then add/update bids
    if (amount > 0) {
      book.bids[price] = (book.bids[price] || 0) + amount;
    }
    // 3.2 if amount < 0 then add/update asks
    if (amount < 0) {
      book.asks[price] = (book.asks[price] || 0) + amount;
    }
  } else if (count === 0) {
    // when count = 0 then you have to delete the price level
    // 4.1 if amount = 1 then remove from bids
    if (amount === 1) {
      delete book.bids[price];
    }
    // 4.2 if amount = -1 then remove from asks
    if (amount === -1) {
      delete book.asks[price];
    }
  }
};

export type ConnectionPayload = {
  prec: Precision;
  len: number;
  symbol: string;
  freq: string;
};
export const connectWs = createAction<ConnectionPayload>("connectWs");
export const disconnectWs = createAction("disconnectWs");
