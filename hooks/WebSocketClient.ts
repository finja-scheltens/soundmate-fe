import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Stomp, Client, Message } from "@stomp/stompjs";
import { IMessage } from "react-native-gifted-chat";
import config from "../constants/Config";

class WebSocketClient {
  client: Client;
  currentProfileId: string;
  constructor(currentProfileId: string) {
    this.currentProfileId = currentProfileId;
    this.client = new Client({
      brokerURL: "ws://192.168.178.105:8080/ws",
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = this.onConnected;

    this.client.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };
    this.client.activate();
  }

  connect(profileId: string) {}

  onConnected = () => {
    console.log("Connected");
    this.client.subscribe(
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
    const transformedMessage =
      this.transformIncomingMessagesForGiftedChat(jsonMessage);
   // return transformedMessage;
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
    this.client.publish({
      destination: `/app/chat`, //app/chat/${senderId}/${recipientId}`
      body: stringify,
    });
  };

  disconnect = () => {
    this.client.deactivate();
  };

  transformMessagesForGiftedChat(
    messages: any[],
    myProfileId: string,
    profilePictureUrl: string
  ): IMessage[] {
    return messages
      .slice()
      .reverse()
      .map((message) => ({
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

  transformIncomingMessagesForGiftedChat(message: any, name: string, profilePictureUrl: string): IMessage {
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


export { WebSocketClient }; //, initializeWebSocketClient };
