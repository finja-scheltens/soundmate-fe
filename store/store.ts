import { legacy_createStore as createStore, combineReducers } from "redux";
import userReducer from "./reducers/user";
import locationReducer from "./reducers/location";

const rootReducer = combineReducers({
  user: userReducer,
  location: locationReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export default store;
