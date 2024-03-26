import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
  Image,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import { RootStackParamList, UserData, ArtistData, GenreData } from "../types";
import { AppColors } from "../constants/AppColors";
import config from "../constants/Config";

import { Text } from "../components/Themed";
import ListItem from "../components/ListItem";
import PrimaryButton from "../components/PrimaryButton";
import Badge from "../components/Badge";
import { Entypo } from "@expo/vector-icons";

const user = require("../data/user.json");

type DetailProps = {
  navigation: NativeStackScreenProps<
    RootStackParamList,
    "Detail"
  >["navigation"];
  route: NativeStackScreenProps<RootStackParamList, "Detail">["route"];
};
export default function DetailScreen({ route, navigation }: DetailProps) {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const [matchData, setMatchData] = useState<UserData>({} as UserData);
  const [topArtists, setTopArtists] = useState<ArtistData[]>([]);
  const [topGenres, setTopGenres] = useState<GenreData[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { profileId } = route.params;

  useEffect(() => {
    const getMatchData = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      axios(`${config.API_URL}/api/profile/${profileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setMatchData(response.data);
          setTopArtists(response.data.topArtists);
          setTopGenres(response.data.topGenres);
        })
        .catch(error => {
          console.log("error", error.message);
        })
        .finally(() => setLoading(false));
    };
    getMatchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator style={styles.loading} />
  ) : (
    <View style={styles.scrollContainer}>
      <ScrollView ref={ref} style={styles.scrollContainer}>
        <View style={styles.profileHeaderContainer}>
          <SafeAreaView></SafeAreaView>
          <ImageBackground
            source={
              matchData.profilePictureUrl
                ? { uri: matchData.profilePictureUrl }
                : require("../assets/images/avatar.png")
            }
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
              size={28}
              color={AppColors.GREY_900}
            />
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.userName}>
            {matchData.name}, {matchData.age}
          </Text>
          <View style={styles.instaInfo}>
            <Ionicons
              name="logo-instagram"
              size={18}
              color={AppColors.GREY_500}
            />
            <Text style={styles.eMail}>{matchData.contactInfo}</Text>
          </View>
          <View style={styles.subInfoBio}>
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={AppColors.GREY_500}
            />
            <Text style={styles.subTextBio}>{matchData.bio}</Text>
          </View>
          {/* TODO: dynamisch */}
          <View style={styles.matchingInfo}>
            <View style={styles.matchingTextContainer}>
              <Text style={styles.matchingText}>
                Du und {matchData.name} habt ein 80% Match
              </Text>
              <TouchableOpacity
                style={styles.moreInformation}
                onPress={() => navigation.push("MatchingInfo")}
              >
                <Text>Mehr Informationen</Text>
                <Entypo name="chevron-small-right" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <Image
              source={require("../assets/images/match-image.png")}
              style={styles.matchingImage}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Top Genres</Text>
            <View style={styles.genres}>
              {topGenres.map((genre: GenreData, index: number) => (
                <Badge
                  key={index}
                  text={genre.name}
                  style={styles.genreBadge}
                />
              ))}
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.genreHeadline}>Top Künstler</Text>
            <View style={styles.artists}>
              {topArtists.map((artist: ArtistData, index: number) => (
                <ListItem
                  key={index}
                  text={artist.name}
                  imageSource={{ uri: artist.imageUrl }}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title="Sag Hallo auf Instagram"
        style={styles.chatButton}
        onPress={() => {
          Linking.openURL(
            `instagram://user?username=${matchData.contactInfo}`
          ).catch(() => {
            Linking.openURL(
              `https://www.instagram.com/${matchData.contactInfo}`
            );
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "white",
  },
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
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 10,
    borderColor: AppColors.GREY_300,
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
    marginBottom: 6,
  },
  instaInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  subInfoBio: {
    display: "flex",
    flexDirection: "row",
    marginTop: 6,
    marginRight: 20,
  },
  eMail: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.GREY_500,
    marginLeft: 6,
  },
  subTextBio: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.GREY_500,
    marginLeft: 6,
    lineHeight: 18,
  },
  matchingInfo: {
    marginTop: 35,
    backgroundColor: AppColors.SECONDARY,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
  matchingTextContainer: {
    flex: 1,
    gap: 16,
  },
  matchingText: {
    fontSize: 16,
    fontWeight: "600",
  },
  matchingImage: {
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  moreInformation: {
    flexDirection: "row",
    alignItems: "center",
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
    gap: 10,
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
    width: "90%",
    shadowColor: AppColors.GREY_900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
