import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import userReducer from "./reducers/user";
import locationReducer from "./reducers/location";
import webSocketClientReducer from "./reducers/webSocketClientReducer";
import webSocketMiddleware from "./webSocketMiddleware";

const rootReducer = combineReducers({
  user: userReducer,
  location: locationReducer,
  WebSocketClient: webSocketClientReducer
});

const store = createStore(rootReducer, applyMiddleware(webSocketMiddleware));

export type RootState = ReturnType<typeof rootReducer>;
export default store;