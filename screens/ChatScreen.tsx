import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../types";

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
  const [name, setName] = useState("Finja");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const { profileId } = route.params;

  const onSend = (newMessages: any) => {
    setMessages(GiftedChat.append(messages, newMessages));
  };

  const user = {
    _id: name,
    name,
    avatar:
      "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375__340.png",
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
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
