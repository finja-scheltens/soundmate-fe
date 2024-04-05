import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import axios from "axios";
import config from "../constants/Config";
import { WebSocketClient } from "../hooks/WebSocketClient";

import { RootStackParamList } from "../types";
import { AppColors } from "../constants/AppColors";

import SearchBar from "../components/SearchBar";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb8ba",
    userName: "First Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

type ChatRoom = {
  chatId: string;
  name: string;
  profilePictureUrl: string;
  senderProfileId: string;
  recipientProfileId: string;
};

export default function ChatListScreen({ route, navigation }: Props) {
  const [chatRoomData, setChatRoomData] = useState<ChatRoom[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [chats, setChats] = useState(DATA);


  const filterChats = () => {
    if (!searchPhrase.trim()) {
      setChats(DATA);
    } else {
      const filteredChats = DATA.filter(item =>
        item.userName.toLowerCase().includes(searchPhrase.toLowerCase())
      );
      setChats(filteredChats);
    }
  };

  useEffect(() => {
    filterChats();
  }, [searchPhrase]);

  useEffect(() => {
    const getChatRoomData = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      axios(`${config.API_URL}/chatRooms`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setChatRoomData(response.data);
        })
        .catch((error) => {
          console.log("error", error.message);
        })
        .finally(() => setLoading(false));
    };
    getChatRoomData();
  }, []);

  return isLoading ? (
    <ActivityIndicator style={styles.loading} />
  ) : (
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
      <FlatList
        data={chatRoomData}
      
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => navigation.push("Chat", { chatId: item.chatId, name: item.name, profilePictureUrl: item.profilePictureUrl, senderProfileId: item.senderProfileId, recipientProfileId: item.recipientProfileId })}
          >
            <View style={styles.item}>
              <Image
                source={{
                  uri: item.profilePictureUrl,
                }}
                style={styles.profileImg}
              />
              <View style={styles.chatText}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  This is hard coded
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
      />
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
});
