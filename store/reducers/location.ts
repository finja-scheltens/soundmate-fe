import { LocationActionTypes, UPDATE_LOCATION, RESET_LOCATION } from "../actions/location";
import { UserLocation } from "../../types";

const initialState: UserLocation = {
  location: null,
};

const locationReducer = (
  state = initialState,
  action: LocationActionTypes
): UserLocation => {
  switch (action.type) {
    case UPDATE_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    case RESET_LOCATION:
      return {
        ...state,
        location: null,
      };
    default:
      return state;
  }
};

export default locationReducer;
