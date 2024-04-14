import { MiddlewareAPI, Dispatch, Middleware } from "redux";
import {
  CONNECT_WEBSOCKET,
  DISCONNECT_WEBSOCKET,
  SET_CHATROOMS,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  storeIncomingMessage,
  deleteIncomingMessage,
} from "./actions/webSocketClientActions";
import { WebSocketClient } from "../utils/WebSocketClient";
import { ChatRoom } from "../types";

let webSocketClient: WebSocketClient | null = null;

const webSocketMiddleware: Middleware =
  (store: MiddlewareAPI) => (next: Dispatch) => async action => {
    switch (action.type) {
      case SET_CHATROOMS:
        break;

      case CONNECT_WEBSOCKET:
        let chatRooms: ChatRoom[] = [];
        if (webSocketClient === null) {
          webSocketClient = new WebSocketClient(
            action.payload.profileId,
            action.payload.dispatch
          );
        }
        try {
          chatRooms = await webSocketClient!.initializeChatroomData();
          store.dispatch({
            type: "SET_CHATROOMS",
            payload: chatRooms,
          });
        } catch (error) {
          console.error("Failed to load chat rooms:", error);
        }

        try {
          const chatIdMessages =
            await webSocketClient!.initializeSavedChatMessagesForChatRooms(
              chatRooms
            );
          store.dispatch({
            type: "SET_MESSAGES_FOR_CHATROOM",
            payload: chatIdMessages,
          });
        } catch (error) {
          console.error("Failed to load messages for chat room:", error);
        }
        break;

      case SEND_MESSAGE:
        webSocketClient!.sendMessage(
          action.payload.message.text,
          action.payload.senderProfileId,
          action.payload.recipientProfileId
        );
        const sendAllMessages = store.getState().WebSocketClient.messages;
        const sendUpdatedMessages = sendAllMessages.chatIdMessages;
        store.dispatch({
          type: "SET_MESSAGES_FOR_CHATROOM",
          payload: sendUpdatedMessages,
        });
        break;

      case RECEIVE_MESSAGE:
        const allChatRooms = store.getState().WebSocketClient.chatRooms;
        const chatId = action.payload.message.chatId;
        const chatRoom: ChatRoom = allChatRooms.find(
          (room: any) => room.chatId === chatId
        );
        const transformedMessage =
          webSocketClient?.transformIncomingMessagesForGiftedChat(
            action.payload.message,
            chatRoom?.name,
            chatRoom?.profilePictureUrl
          );
        const allMessages = store.getState().WebSocketClient.messages;
        const updatedMessages = allMessages.chatIdMessages;
        updatedMessages[chatId].unshift(transformedMessage);

        store.dispatch({
          type: "SET_MESSAGES_FOR_CHATROOM",
          payload: updatedMessages,
        });

        store.dispatch({
          type: "NEW_MESSAGE_RECEIVED",
          payload: transformedMessage,
        });

          store.dispatch(storeIncomingMessage(transformedMessage!));

        break;

      case DISCONNECT_WEBSOCKET:
        if (webSocketClient !== null) {
          webSocketClient.disconnect();
          webSocketClient = null;
        }
        break;
      default:
        break;
    }
    return next(action);
  };

export default webSocketMiddleware;
