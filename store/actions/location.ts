import { UserLocation } from "../../types";

export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const RESET_LOCATION = "RESET_LOCATION";

interface UpdateLocationAction {
  type: typeof UPDATE_LOCATION;
  payload: UserLocation["location"];
}

interface ResetLocationAction {
  type: typeof RESET_LOCATION;
}

export type LocationActionTypes = UpdateLocationAction | ResetLocationAction;

export const updateLocation = (
  location: UserLocation["location"]
): LocationActionTypes => ({
  type: UPDATE_LOCATION,
  payload: location,
});

export const resetLocation = (): LocationActionTypes => ({
  type: RESET_LOCATION,
});
