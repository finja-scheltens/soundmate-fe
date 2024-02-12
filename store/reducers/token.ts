import { ADD_TOKEN } from "../actions/token";

type TokenAction = {
  type: string;
  token: string;
};

type TokenState = {
  token: string;
};

const initialState: TokenState = {
  token: "",
};

export default (
  state: TokenState = initialState,
  action: TokenAction
): TokenState => {
  switch (action.type) {
    case ADD_TOKEN:
      const token = action.token;
      return {
        ...state,
        token: token,
      };
    default:
      return state;
  }
};
