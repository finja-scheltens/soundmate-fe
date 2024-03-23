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
  {
    id: "3ac68afc-c605-48d3-a4f8-bd91aa97f63",
    userName: "Second Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "58694a0f-3da1-471f-bd96-14571e29d72",
    userName: "Third Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "bd7acbea-c11-46c2-aed5-3ad53abb2ba",
    userName: "First Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3ac68afc-c60-48d3-4f8-fbd91aa97f63",
    userName: "Second Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "58694a0f-3da-471fbd96-145571e29d72",
    userName: "Third Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "bd7acbea-c1b1-46c-aed5-3ad53abb28ba",
    userName: "First Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8fbd91aa97f63",
    userName: "Second Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "58694a0f-3da1-471f-bd9-145571e29d72",
    userName: "Third Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "bd7abea-c1b1-46c-aed5-3ad53abb28ba",
    userName: "First Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3ac68afc-c05-48d3-a4f8fbd91aa97f63",
    userName: "Second Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "5694a0f-3da1-471f-bd9-145571e29d72",
    userName: "Third Item",
    lastMessage: "Hallo i bims",
    uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

type ItemProps = {
  userName: string;
  uri: string;
  lastMessage: string;
  navigation: Props;
};

export default function ChatListScreen({ navigation }: Props) {
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
      <FlatList
        data={chats}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => navigation.push("Chat", { profileId: item.id })}
          >
            <View style={styles.item}>
              <Image
                source={{
                  uri: item.uri,
                }}
                style={styles.profileImg}
              />
              <View style={styles.chatText}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
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
});
