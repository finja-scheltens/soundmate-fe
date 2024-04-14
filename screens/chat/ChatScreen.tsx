import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat, IMessage, Send } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../../types";
import { useSelector } from "react-redux";
import store, { RootState } from "../../store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AppColors } from "../../constants/AppColors";

type ChatProps = {
  route: NativeStackScreenProps<RootStackParamList, "Chat">["route"];
};

export default function ChatScreen({ route }: ChatProps) {
  const allMessages = useSelector(
    (state: RootState) => state.WebSocketClient.messages as any
  );
  const messages = allMessages.chatIdMessages[route.params.chatId];
  const { chatId, senderProfileId, recipientProfileId } = route.params;

  const onSend = (newMessages: IMessage[]) => {
    console.log(newMessages[0]._id);
    const chatMessage: IMessage = {
      _id: newMessages[0]._id,
      text: newMessages[0].text,
      createdAt: new Date(),
      user: {
        _id: senderProfileId,
      },
    };

    const updatedMessages = allMessages.chatIdMessages;
    updatedMessages[chatId].unshift(chatMessage);
    store.dispatch({
      type: "SEND_MESSAGE",
      payload: {
        message: chatMessage,
        senderProfileId: senderProfileId,
        recipientProfileId: recipientProfileId,
        chatId: chatId,
      },
    });
  };

  //Sender
  const user = {
    _id: route.params.senderProfileId,
  };

  const renderSend = (sendProps: any) => {
    return (
      <Send {...sendProps}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <MaterialCommunityIcons
            name="send-circle"
            size={40}
            color={AppColors.PRIMARY}
          />
        </View>
      </Send>
    );
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
        renderSend={renderSend}
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
