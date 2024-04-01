import { UserData } from "../../types";

export const SET_USER_DATA = "SET_USER_DATA";
export const RESET_USER_DATA = "RESET_USER_DATA";

interface SetUserAction {
  type: typeof SET_USER_DATA;
  payload: UserData;
}

interface ResetUserAction {
  type: typeof RESET_USER_DATA;
}

export type UserActionTypes = SetUserAction | ResetUserAction;

export const setUserData = (usersData: UserData): UserActionTypes => ({
  type: SET_USER_DATA,
  payload: usersData,
});

export const resetUserData = (): UserActionTypes => ({
  type: RESET_USER_DATA,
});
