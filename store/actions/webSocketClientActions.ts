import { IMessage } from "react-native-gifted-chat";
import { ChatRoom, ChatIdMessages } from "../../types";

export const SET_CHATROOMS = "SET_CHATROOMS";
export const SET_MESSAGES_FOR_CHATROOM = "SET_MESSAGES_FOR_CHATROOM";
export const CONNECT_WEBSOCKET = "CONNECT_WEBSOCKET";
export const DISCONNECT_WEBSOCKET = "DISCONNECT_WEBSOCKET";
export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const NEW_MESSAGE_RECEIVED = "NEW_MESSAGE_RECEIVED";
export const STORE_INCOMING_MESSAGE = "STORE_INCOMING_MESSAGE";
export const DELETE_INCOMING_MESSAGE = "DELETE_INCOMING_MESSAGE";

export const setChatRooms = (chatRooms: ChatRoom[]) => ({
  type: SET_CHATROOMS,
  payload: chatRooms,
});

export const setMessagesForChatRoom = (chatIdMessages: ChatIdMessages) => ({
  type: SET_MESSAGES_FOR_CHATROOM,
  payload: { chatIdMessages },
});
export const connectWebSocket = (profileId: string, dispatch: any) => ({
  type: CONNECT_WEBSOCKET,
  payload: { profileId, dispatch },
}
);

export const disconnectWebSocket = () => ({
  type: DISCONNECT_WEBSOCKET,
});

export const sendMessage = (message: IMessage) => ({
  type: SEND_MESSAGE,
})

export const receiveMessage = (message: any) => ({
  type: RECEIVE_MESSAGE,
  payload: { message },
});

export const newMessageReceived = (message: any) => ({
  type: NEW_MESSAGE_RECEIVED,
  payload: { message },
});

export const storeIncomingMessage = (message: IMessage) => ({
  type: STORE_INCOMING_MESSAGE,
  payload: { message },
});

export const deleteIncomingMessage = (message: IMessage) => ({
  type: DELETE_INCOMING_MESSAGE,
  payload: { message },
});




