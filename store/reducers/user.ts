import { ActionTypes } from "../actions/user";
import { UserData } from "../../types";

type UserAction = {
  type: string;
  user: UserData;
};

const initialState = {
  usersData: {} as UserData,
};

const userReducer = (state = initialState, action: UserAction) => {
  switch (action.type) {
    case ActionTypes.SET_USER_DATA:
      return {
        ...state,
        usersData: action.user,
      };
    default:
      return state;
  }
};

export default userReducer;
