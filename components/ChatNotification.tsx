import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../constants/AppColors";
import { ChatRoom } from "../types";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface ChatNotificationProps {
  messageProperties: {
    profileId: string;
    profileImage: string;
    userName: string;
    message: string;
  };
  onDismiss: () => void;
}

export default function ChatNotification({
  messageProperties,
  onDismiss,
}: ChatNotificationProps) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: -500 })).current;
  const navigation = useNavigation();
  const chatRooms: ChatRoom[] = useSelector(
    (state: RootState) => state.WebSocketClient.chatRooms
  );
  useEffect(() => {
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: 700,
      useNativeDriver: false,
    }).start();

    const timeout = setTimeout(() => {
      dismissNotification();
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const dismissNotification = () => {
    Animated.timing(pan, {
      toValue: { x: 0, y: -500 },
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      onDismiss();
    });
  };

  const animatedStyle = {
    transform: pan.getTranslateTransform(),
  };

  const navigateToChat = (profileId: string, userName: string) => {
    const matchingChatRoom = chatRooms.find(
      (chatRoom) => chatRoom.recipientProfileId.toString() === profileId
    );
    navigation.navigate("Chat", {
      chatId: matchingChatRoom!.chatId,
      name: userName,
      profilePictureUrl: matchingChatRoom!.profilePictureUrl,
      senderProfileId: matchingChatRoom!.senderProfileId,
      recipientProfileId: matchingChatRoom!.recipientProfileId,
    });
    onDismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.notificationContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.touchableArea}
          onPress={() =>
            navigateToChat(
              messageProperties.profileId,
              messageProperties.userName
            )
          }
        >
          <Image
            source={{ uri: messageProperties.profileImage }}
            style={styles.userImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{messageProperties.userName}</Text>
            <Text style={styles.message} numberOfLines={2}>
              {messageProperties.message}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={dismissNotification}>
          <Ionicons name="close" size={32} color={AppColors.PRIMARY} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    elevation: 5,
    paddingHorizontal: 14,
    zIndex: 1000,
  },
  notificationContainer: {
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: "#43444a",
    flexDirection: "row",
    alignItems: "center",
  },
  touchableArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 50,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  message: {
    fontSize: 14,
    color: "white",
  },
});
