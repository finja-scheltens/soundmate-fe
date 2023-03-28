import * as React from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import { Text } from "../components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useScrollToTop } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { AppColors } from "../constants/AppColors";
import { RootTabScreenProps } from "../types";
import { Key } from "react";
import Badge from "../components/Badge";
import ListItem from "../components/ListItem";
import SecondaryButton from "../components/SecondaryButton";
import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }: any) {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const [usersData, setUsersData] = useState<any>([]);
  const [topArtists, setTopArtists] = useState<any>([]);
  const [topGenres, setTopGenres] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      axios("http://82.165.77.87:8080/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setUsersData(response.data);
          setTopArtists(response.data.topArtists);
          setTopGenres(response.data.topGenres);
        })
        .catch(error => {
          console.log("error", error.message);
        })
        .finally(() => setLoading(false));
    };
    getProfileData();
  }, []);

  async function logout() {
    await SecureStore.deleteItemAsync("token");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  return isLoading ? (
    <ActivityIndicator style={styles.loading} />
  ) : (
    <ScrollView ref={ref} style={styles.scrollContainer}>
      <View style={styles.profileHeaderContainer}>
        <Image
          source={
            usersData.profilePictureUrl
              ? { uri: usersData.profilePictureUrl }
              : require("../assets/images/avatar.png")
          }
          style={styles.profileHeaderImage}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.userData}>
          <Text style={styles.userName}>
            {usersData.name}, {usersData.age}
          </Text>
          <View>
            <SecondaryButton
              title="Ändern"
              onPress={() =>
                navigation.navigate("UserInfo", { isLogin: false })
              }
            />
          </View>
        </View>
        <View style={styles.subInfo}>
          <Ionicons
            name="logo-instagram"
            size={18}
            color={AppColors.GREY_500}
          />
          <Text style={styles.subText}>{usersData.contactInfo}</Text>
        </View>
        <View style={styles.subInfoBio}>
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={AppColors.GREY_500}
          />
          <Text style={styles.subTextBio}>{usersData.bio}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.genreHeadline}>Deine Top Genres</Text>
          <View style={styles.genres}>
            {topGenres.map(
              (genre: any | undefined, index: Key | null | undefined) => (
                <Badge
                  key={index}
                  text={genre.name}
                  style={styles.genreBadge}
                />
              )
            )}
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.genreHeadline}>Deine Top Künstler</Text>
          <View style={styles.artists}>
            {topArtists.map((artist: any, index: Key | null | undefined) => (
              <ListItem
                key={index}
                text={artist.name}
                imageSource={{ uri: artist.imageUrl }}
              />
            ))}
          </View>
        </View>
      </View>
      <TouchableHighlight onPress={logout} underlayColor="white">
        <Text style={styles.logout}>Abmelden</Text>
      </TouchableHighlight>
    </ScrollView>
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
    alignItems: "center",
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
    borderRadius: 30,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  contentContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  userData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 6,
  },
  userName: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
  },
  subInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginRight: 20,
  },
  subInfoBio: {
    display: "flex",
    flexDirection: "row",
    marginTop: 6,
    marginRight: 20,
  },
  subText: {
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
    paddingBottom: 20,
  },
  logout: {
    marginTop: 8,
    marginBottom: 26,
    color: AppColors.PRIMARY,
    textAlign: "center",
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
});
