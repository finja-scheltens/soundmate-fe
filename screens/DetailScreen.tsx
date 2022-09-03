import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Text } from "../components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

import ListItem from "../components/ListItem";
import PrimaryButton from "../components/PrimaryButton";
import Badge from "../components/Badge";
import { AppColors } from "../constants/AppColors";

import { useScrollToTop } from "@react-navigation/native";
import { Key } from "react";

const user = require("../data/user.json");

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function HomeScreen({ route, navigation }: Props | any) {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const item = route.params;

  return (
    <View style={styles.scrollContainer}>
      <ScrollView ref={ref} style={styles.scrollContainer}>
        <View style={styles.profileHeaderContainer}>
          <SafeAreaView></SafeAreaView>
          <ImageBackground
            source={{ uri: "https://picsum.photos/200" }}
            style={styles.profileHeaderImage}
            imageStyle={{
              borderRadius: 30,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={30}
              color={AppColors.GREY_900}
            />
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.eMail}>fin.ja@hotmail.com</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Deine Genres</Text>
            <View style={styles.genres}>
              {user.genres.map(
                (genre: string | undefined, index: Key | null | undefined) => (
                  <Badge key={index} text={genre} style={styles.genreBadge} />
                )
              )}
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Deine Top Künstler</Text>
            <View style={styles.artists}>
              {user.artists.map(
                (artist: string | undefined, index: Key | null | undefined) => (
                  <ListItem
                    key={index}
                    text={artist}
                    imageSource={require("../assets/images/artist.jpg")}
                  />
                )
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title="Say hello"
        style={styles.chatButton}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  profileHeaderContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "transparent",
    shadowColor: "black",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  profileHeaderImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  backButton: {
    backgroundColor: "white",
    zIndex: 100,
    width: 45,
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 10,
    opacity: 0.7,
    borderColor: AppColors.GREY_500,
    borderWidth: 0.5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  userName: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
    marginTop: 25,
  },
  eMail: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.GREY_500,
    marginTop: 8,
  },
  infoContainer: {
    backgroundColor: "white",
    marginTop: 35,
  },
  genreHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
  },
  genres: {
    marginTop: 12,
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreBadge: {
    marginRight: 10,
    marginBottom: 10,
  },
  artists: {
    marginTop: 12,
    backgroundColor: "white",
    paddingBottom: 110,
  },
  chatButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
});
