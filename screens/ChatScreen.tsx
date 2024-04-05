import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../types";

import * as SecureStore from "expo-secure-store";
import axios from "axios";
import config from "../constants/Config";
import { WebSocketClient } from "../hooks/WebSocketClient";

const MOCK_MESSAGES = [
  {
    _id: 1,
    text: "Hello, World!",
    createdAt: new Date(),
    user: {
      _id: 2,
      name: "Simple Chatter",
      avatar:
        "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375__340.png",
    },
  },
];

type ChatProps = {
  route: NativeStackScreenProps<RootStackParamList, "Chat">["route"];
};

export default function ChatScreen({ route }: ChatProps) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setLoading] = useState(false);
  const webSocketClient = new WebSocketClient(route.params.senderProfileId);

  useEffect(() => {
    const getSavedMessages = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      axios(
        `${config.API_URL}/messages/${route.params.senderProfileId}/${route.params.recipientProfileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          const processedMessages =
            webSocketClient.transformMessagesForGiftedChat(
              response.data,
              route.params.senderProfileId,
              route.params.profilePictureUrl
            );
          setMessages(processedMessages);
        })
        .catch((error) => {
          console.log("error", error.message);
        })
        .finally(() => setLoading(false));
    };
    getSavedMessages();
  }, []);

  const {
    chatId,
    name,
    profilePictureUrl,
    senderProfileId,
    recipientProfileId,
  } = route.params;

  useEffect(() => {
    webSocketClient.onMessageReceived = handleMessageReceived;
  });

  const handleMessageReceived = (newMessage: any) => {
    //console.log("Date" + new Date(jsonMessage.timestamp));
    //console.log(jsonMessage);
     const string = new TextDecoder("utf-8").decode(newMessage._binaryBody);
     const jsonMessage = JSON.parse(string);
     const transformedMessage =
       webSocketClient.transformIncomingMessagesForGiftedChat(jsonMessage, name, profilePictureUrl);
    setMessages(GiftedChat.append(messages, [transformedMessage]));
    console.log(transformedMessage);
  };

  const onSend = (newMessages: any) => {
    webSocketClient.sendMessage(
      newMessages[0].text,
      senderProfileId,
      recipientProfileId
    );
    setMessages(GiftedChat.append(messages, newMessages));
  };

  //Sender
  const user = {
    _id: route.params.senderProfileId,
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={user}
        renderUsernameOnMessage
        placeholder="Nachricht schreiben..."
        bottomOffset={36}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
