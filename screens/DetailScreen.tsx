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
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import {
  RootStackParamList,
  UserData,
  ArtistData,
  GenreData,
  GenderType,
} from "../types";
import { AppColors } from "../constants/AppColors";
import config from "../constants/Config";
import { RootState } from "../store/store";

import { Text } from "../components/Themed";
import ListItem from "../components/ListItem";
import PrimaryButton from "../components/PrimaryButton";
import Badge from "../components/Badge";

type DetailProps = {
  navigation: NativeStackScreenProps<
    RootStackParamList,
    "Detail"
  >["navigation"];
  route: NativeStackScreenProps<RootStackParamList, "Detail">["route"];
};

type Factors = {
  novelFactor: number;
  mainstreamFactor: number;
  diverseFactor: number;
};

export default function DetailScreen({ route, navigation }: DetailProps) {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const [matchData, setMatchData] = useState<UserData>({} as UserData);
  const [topArtists, setTopArtists] = useState<ArtistData[]>([]);
  const [topGenres, setTopGenres] = useState<GenreData[]>([]);
  const [matchingPercentage, setMatchingPercentage] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const usersData = useSelector((state: RootState) => state.user.usersData);
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

  useEffect(() => {
    calculateMatchingFactor();
  }, [matchData]);

  const calculateMatchingFactor = () => {
    const userFactors: Factors = {
      novelFactor: usersData.novelFactor,
      mainstreamFactor: usersData.mainstreamFactor,
      diverseFactor: usersData.diverseFactor,
    };

    const matchFactors: Factors = {
      novelFactor: matchData.novelFactor,
      mainstreamFactor: matchData.mainstreamFactor,
      diverseFactor: matchData.diverseFactor,
    };

    // calculate euclidean distance between two points in 3D space
    const squaredDistance = Object.keys(userFactors).reduce((acc, key) => {
      const factorKey = key as keyof Factors;
      return (
        acc + Math.pow(userFactors[factorKey] - matchFactors[factorKey], 2)
      );
    }, 0);

    // normalize distance with maximum possible distance and calculate matching percentage for specific match
    const distanceNoramalized = Math.sqrt(squaredDistance) / Math.sqrt(3);
    const matchingPercentage = Math.round((1 - distanceNoramalized) * 100);

    setMatchingPercentage(matchingPercentage);
  };

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
              color={AppColors.GREY_700}
            />
            <Text style={styles.infoText}>{matchData.contactInfo}</Text>
          </View>
          <View style={styles.genderInfo}>
            <FontAwesome6
              name="person-half-dress"
              size={18}
              color={AppColors.GREY_700}
            />
            <Text style={styles.infoText}>
              {
                GenderType[
                  matchData.genderType as string as keyof typeof GenderType
                ]
              }
            </Text>
          </View>
          <Text style={styles.subTextBio}>{matchData.bio}</Text>
          <View style={styles.matchingInfo}>
            <View style={styles.matchingTextContainer}>
              <Text style={styles.matchingText}>
                Du und {matchData.name} habt ein {matchingPercentage}% Match
              </Text>
              <TouchableOpacity
                hitSlop={15}
                style={styles.moreInformation}
                onPress={() =>
                  navigation.push("MatchingInfo", {
                    matchData,
                    matchingPercentage,
                  })
                }
              >
                <Text style={{ color: "white" }}>Mehr Informationen</Text>
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
    marginTop: Platform.OS === "android" ? 40 : 10,
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
    marginBottom: 12,
  },
  instaInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  genderInfo: {
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
    marginLeft: 3,
    gap: 4,
  },
  infoText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.GREY_700,
    marginLeft: 6,
  },
  subTextBio: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.GREY_700,
    lineHeight: 20,
    marginVertical: 24,
    marginLeft: 3,
  },
  matchingInfo: {
    marginTop: 8,
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
    lineHeight: 22,
    color: "white",
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
    bottom: 45,
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
