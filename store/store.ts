import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import tokenReducer from "./reducers/token";
import webSocketClientReducer from "./reducers/webSocketClientReducer";
import webSocketMiddleware from "./webSocketMiddleware";

const rootReducer = combineReducers({
  tokenReducer: tokenReducer,
  WebSocketClient: webSocketClientReducer,
});

const store = createStore(rootReducer, applyMiddleware(webSocketMiddleware));

export type RootState = ReturnType<typeof rootReducer>;
export default store;
