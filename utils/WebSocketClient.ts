import * as SecureStore from "expo-secure-store";
import { Client } from "@stomp/stompjs";
import { IMessage } from "react-native-gifted-chat";
import config from "../constants/Config";
import axios from "axios";
import { ChatRoom, ChatIdMessages } from "../types";
import { receiveMessage } from "../store/actions/webSocketClientActions";

class WebSocketClient {
  client: Client | null = null;
  currentProfileId: string;
  dispatch: any;

  constructor(currentProfileId: string, dispatch: any) {
    this.dispatch = dispatch;
    this.currentProfileId = currentProfileId;
    this.connect();
  }

  connect() {
    this.client = new Client({
      brokerURL: "ws://82.165.237.61:8080/ws",
      debug: function (str: string) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = this.onConnected;

    this.client.onStompError = function (frame: any) {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };
    this.client.activate();
  }

  onConnected = () => {
    this.client!.subscribe(
      `/user/${this.currentProfileId}/queue/messages`,
      this.onMessageReceived
    );
  };

  onError = (error: any) => {
    console.log("Error", error);
  };

  onMessageReceived = (message: any) => {
    const string = new TextDecoder("utf-8").decode(message._binaryBody);
    const jsonMessage = JSON.parse(string);
    this.dispatch(receiveMessage(jsonMessage));
    return jsonMessage;
  };

  sendMessage = (
    messageInput: string,
    senderId: string,
    recipientId: string
  ) => {
    const chatMessage = {
      sender: senderId,
      recipient: recipientId,
      content: messageInput.trim(),
      timestamp: new Date(),
    };
    const stringify = JSON.stringify(chatMessage);
    this.client!.publish({
      destination: `/app/chat`,
      body: stringify,
    });
  };

  disconnect = () => {
    this.client!.deactivate();
  };

  transformMessagesForGiftedChat(
    messages: any[],
    myProfileId: string,
    profilePictureUrl: string
  ): IMessage[] {
    return messages
      .slice()
      .reverse()
      .map(message => ({
        _id: message.chatMessageId,
        text: message.content,
        createdAt: new Date(message.timestamp),
        user: {
          _id: message.senderProfileId,
          name: message.senderName,
          avatar: profilePictureUrl,
        },
      }));
  }

  async initializeChatroomData(): Promise<ChatRoom[]> {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios(`${config.API_URL}/chatRooms`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("error", error.message);
      return [];
    }
  }

  async createChatRoom(profileId: string): Promise<ChatRoom> {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios(
        `${config.API_URL}/createChatRoom/${profileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("error", error.message);
      return {} as ChatRoom;
    }
  }

  async initializeSavedChatMessagesForChatRooms(chatRooms: ChatRoom[]) {
    const chatIdMessages: ChatIdMessages = {};
    for (const chatRoom of chatRooms) {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await axios(
          `${config.API_URL}/messages/${chatRoom.senderProfileId}/${chatRoom.recipientProfileId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        chatIdMessages[chatRoom.chatId] = this.transformMessagesForGiftedChat(
          response.data,
          chatRoom.senderProfileId,
          chatRoom.profilePictureUrl
        );
      } catch (error: any) {
        console.error("error", error.message);
        return [];
      }
    }
    return chatIdMessages;
  }

  transformIncomingMessagesForGiftedChat(
    message: any,
    name: string,
    profilePictureUrl: string
  ): IMessage {
    return {
      _id: message.chatMessageId,
      text: message.content,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.senderId,
        name: name,
        avatar: profilePictureUrl,
      },
    };
  }
}

export { WebSocketClient };
