import {
  UserActionTypes,
  RESET_USER_DATA,
  SET_USER_DATA,
} from "../actions/user";
import { UserData } from "../../types";

const initialState = {
  usersData: {} as UserData,
};

const userReducer = (state = initialState, action: UserActionTypes) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        usersData: action.payload,
      };
    case RESET_USER_DATA:
      return {
        ...state,
        usersData: {} as UserData,
      };
    default:
      return state;
  }
};

export default userReducer;
