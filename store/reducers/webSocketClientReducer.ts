import {
  CONNECT_WEBSOCKET,
  DISCONNECT_WEBSOCKET,
  RECEIVE_MESSAGE,
  SET_CHATROOMS,
  SET_MESSAGES_FOR_CHATROOM,
  SEND_MESSAGE,
  NEW_MESSAGE_RECEIVED,
  CREATE_CHATROOM,
  NEW_CHATROOM,
} from "../actions/webSocketClientActions";

const initialState = {
  isConnected: false,
  chatRooms: [],
  messages: {}, // { chatId: [messages] }
  profileId: null,
  newChatMesssage: {},
  newChatRoom: {}
  
};

// Reducer Funktion
const webSocketClientReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CHATROOMS:
      return { ...state, chatRooms: action.payload };

    case SET_MESSAGES_FOR_CHATROOM:
      const updatedState = {
        ...state,
        messages: {
          ...state.messages,
          chatIdMessages: action.payload,
        },
      };
      return updatedState;

    case CONNECT_WEBSOCKET:
      return {
        ...state,
        isConnected: true,
        profileId: action.payload.profileId,
      };
    case DISCONNECT_WEBSOCKET:
      return {
        ...state,
        isConnected: false,
        profileId: null,
      };
    case RECEIVE_MESSAGE:
      return {
        ...state,
      };
    case SEND_MESSAGE:
      return {
        ...state,
      };
    case NEW_MESSAGE_RECEIVED:
      return {
        ...state,
        newChatMesssage: action.payload,
      };
    case CREATE_CHATROOM:
      return {
        ...state,
        chatRoom: action.payload,
      };
    case NEW_CHATROOM:
      return {
        ...state,
        newChatRoom: action.payload,
      };

    default:
      return state;
  }
};

export default webSocketClientReducer;
