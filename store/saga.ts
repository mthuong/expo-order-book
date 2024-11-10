import {
  call,
  cancelled,
  fork,
  put,
  race,
  take,
  takeLatest,
} from "redux-saga/effects";
import {
  ConnectionPayload,
  connectWs,
  disconnectWs,
  handleDataReceived,
  setConnectionState,
} from "./appSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { globalDispatch } from "./dispatcher";

const wsHost = "wss://api-pub.bitfinex.com/ws/2";
const UPDATE_INTERVAL = 400;

// Helper function to create a WebSocket connection
function createWebSocket(url: string) {
  return new WebSocket(url);
}

// WebSocket connection saga
function* manageWebSocketConnection(action: PayloadAction<ConnectionPayload>) {
  const {
    prec = "P0",
    len = 25,
    symbol = "tBTCUSD",
    freq = "F1",
  } = action.payload;
  let socket: WebSocket;
  let events: any[] = [];
  let intervalId: any;
  let active = true; // Flag to track if the WebSocket is active

  yield put(setConnectionState("connecting"));
  // Create a new WebSocket connection
  socket = yield call(createWebSocket, wsHost);

  try {
    // Watch for disconnect requests to close the WebSocket
    yield takeLatest(disconnectWs, function* cancelWs() {
      console.log("socket close");
      intervalId && clearInterval(intervalId);
      active = false; // Set active to false to stop onMessage
      socket.close();
      yield put(setConnectionState("disconnected"));
    });

    // Event listeners for WebSocket events
    const onMessage = (event: { data: string }) => {
      // Process only if the WebSocket is active
      if (!active) return;

      const msg = JSON.parse(event.data);

      if (msg.event) {
        // Handle connection success
        if (msg.event === "subscribed") {
          console.log("subscribed");
          globalDispatch(setConnectionState("connected"));
        }
        return;
      }

      // Handle data messages
      const [channelId, data] = msg;
      if (typeof data?.[0] === "number") {
        events.push(data); // Queue messages for throttling
      } else if (Array.isArray(data?.[0])) {
        globalDispatch(handleDataReceived(data)); // Initial order book data
      }
    };
    const onError = () => globalDispatch(setConnectionState("failed"));

    // Assign WebSocket event handlers
    socket.onmessage = onMessage;
    socket.onerror = onError;

    // Start a subscription on open
    socket.onopen = () => {
      // globalDispatch(setConnectionState("connected"));
      socket.send(
        JSON.stringify({
          event: "subscribe",
          channel: "book",
          symbol,
          prec,
          len,
          freq,
        })
      );

      // Start interval to dispatch throttled events
      intervalId && clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (events.length) {
          globalDispatch(handleDataReceived(events));
          events = [];
        }
      }, UPDATE_INTERVAL);
    };

    // Wait for either disconnection or WebSocket close event
    yield race({
      disconnect: take(disconnectWs),
      close: new Promise<void>((resolve) => {
        socket.onclose = () => {
          console.log("socket onclose");

          active = false; // Set active to false when WebSocket closes
          resolve();
        };
      }),
    });
  } catch (error) {
    yield put(setConnectionState("failed"));
  } finally {
    // @ts-ignore
    if (yield cancelled()) {
      // Clean up WebSocket if the saga is canceled
      active = false; // Set active to false to stop onMessage
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      clearInterval(intervalId); // Clear the interval
      yield put(setConnectionState("disconnected"));
    }
  }
}

// Watcher saga using takeLatest to manage a single active WebSocket connection
function* watchWebSocketConnection() {
  yield takeLatest(connectWs, manageWebSocketConnection);
}

function* appSaga() {
  yield fork(watchWebSocketConnection);
}

export default appSaga;
