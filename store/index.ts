import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import { setDispatcher } from "./dispatcher";
import createSagaMiddleware from "redux-saga";
import appSaga from "./saga";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

setDispatcher(store.dispatch);

sagaMiddleware.run(appSaga);

export default store;
