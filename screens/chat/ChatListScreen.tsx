import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableHighlight,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { ChatIdMessages, ChatRoom } from "../../types";
import { RootStackParamList } from "../../types";
import { AppColors } from "../../constants/AppColors";
import SearchBar from "../../components/SearchBar";
import Indicator from "../../components/Indicator";

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

export default function ChatListScreen({ navigation }: Props) {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const chatRooms: ChatRoom[] = useSelector(
    (state: RootState) => state.WebSocketClient.chatRooms
  );
  const chatIdMessages: ChatIdMessages = useSelector(
    (state: RootState) => state.WebSocketClient.messages
  );

  const getLastMessage = (chatId: string) => {
    return (chatIdMessages.chatIdMessages as any)[chatId][0].text;
  };

  const chatRoomsWithText = chatRooms.filter(
    item => (chatIdMessages.chatIdMessages as any)[item.chatId].length > 0
  );

  const filterChats = () => {
    if (!searchPhrase.trim()) {
      setChats(sortChatsByMostRecent(chatRoomsWithText, chatIdMessages));
    } else {
      const filteredChats = chatRoomsWithText.filter((item) => {
        const nameMatch = item.name
          .toLowerCase()
          .includes(searchPhrase.toLowerCase());
        const lastMessageText =
          (chatIdMessages.chatIdMessages as any)[item.chatId]?.[0]?.text || "";
        const messageMatch = lastMessageText
          .toLowerCase()
          .includes(searchPhrase.toLowerCase());
        return nameMatch || messageMatch;
      });

      setChats(sortChatsByMostRecent(filteredChats, chatIdMessages));
    }
  };

  useEffect(() => {
    filterChats();
  }, [searchPhrase, JSON.stringify(chatIdMessages.chatIdMessages)]);

  const parseISODate = (isoDate: string) => {
    return new Date(isoDate);
  };

  const sortChatsByMostRecent = (
    chatRoomsWithText: ChatRoom[],
    chatIdMessages: ChatIdMessages
  ) => {
    return chatRoomsWithText.sort((a, b) => {
      const lastMessageA = (chatIdMessages.chatIdMessages as any)[a.chatId][0];
      const lastMessageB = (chatIdMessages.chatIdMessages as any)[b.chatId][0];

      const dateA = parseISODate(lastMessageA.createdAt).getTime();
      const dateB = parseISODate(lastMessageB.createdAt).getTime();
      console.log(dateA, dateB);

      return dateB - dateA;
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headline}>Chat</Text>
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
        />
      </SafeAreaView>
      {chats.length ? (
        <FlatList
          data={chats}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() =>
                navigation.push("Chat", {
                  chatId: item.chatId,
                  name: item.name,
                  profilePictureUrl: item.profilePictureUrl,
                  senderProfileId: item.senderProfileId,
                  recipientProfileId: item.recipientProfileId,
                })
              }
            >
              <View style={styles.item}>
                <Image
                  source={
                    item.profilePictureUrl
                      ? { uri: item.profilePictureUrl }
                      : require("../../assets/images/avatar.png")
                  }
                  style={styles.profileImg}
                />
                <View style={styles.chatText}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {getLastMessage(item.chatId)}
                  </Text>
                </View>
                <Indicator />
              </View>
            </TouchableHighlight>
          )}
        />
      ) : (
        <View style={styles.noChatContainer}>
          <Image
            source={require("../../assets/images/empty-state.png")}
            style={styles.noChatsImage}
          />
          <Text style={styles.noChatsHeadline}>Keine Chats</Text>
          <Text style={styles.noChatsText}>
            Hm, hier ist es noch ganz schön ruhig. Also auf die Matches, fertig,
            los!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headline: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
    marginTop: 25,
    marginLeft: 20,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 14,
    marginHorizontal: 20,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 40,
  },
  chatText: {
    gap: 6,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
  lastMessage: {
    fontSize: 14,
    color: AppColors.GREY_500,
  },
  loading: {
    flex: 1,
    backgroundColor: "white",
  },
  noChatContainer: {
    paddingTop: 100,
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  noChatsImage: {
    height: 180,
    resizeMode: "contain",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    opacity: 0.15,
  },
  noChatsHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
    marginTop: 20,
  },
  noChatsText: {
    marginTop: 10,
    marginHorizontal: 34,
    fontFamily: "Inter-Regular",
    color: AppColors.GREY_900,
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
  },
});
