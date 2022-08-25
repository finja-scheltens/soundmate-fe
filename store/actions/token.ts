export const ADD_TOKEN = "ADD_TOKEN";

export const addToken = (token: string) => {
  return { type: ADD_TOKEN, token: token };
};
