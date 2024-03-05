import { UserData } from "../../types";

export enum ActionTypes {
  SET_USER_DATA = "SET_USER_DATA",
}

export const setUserData = (usersData: UserData) => ({
  type: ActionTypes.SET_USER_DATA,
  user: usersData,
});
