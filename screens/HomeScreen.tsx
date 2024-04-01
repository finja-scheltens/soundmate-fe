import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  AppState,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome6 } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import axios from "axios";

import {
  RootStackParamList,
  ArtistData,
  GenreData,
  GenderType,
} from "../types";
import { AppColors } from "../constants/AppColors";
import config from "../constants/Config";
import store, { RootState } from "../store/store";
import { resetUserData, setUserData } from "../store/actions/user";
import { resetLocation, updateLocation } from "../store/actions/location";
import calculateDistance from "../utils";

import { Text } from "../components/Themed";
import Badge from "../components/Badge";
import ListItem from "../components/ListItem";
import SecondaryButton from "../components/SecondaryButton";

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const persistUserLocation = async (lat: number | null, long: number | null) => {
  const token = await SecureStore.getItemAsync("token");
  axios(`${config.API_URL}/api/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      latitude: lat,
      longitude: long,
    },
  }).catch(error => {
    console.log("error", error.message);
  });
};

export default function HomeScreen({ navigation }: HomeProps) {
  const ref = useRef(null);
  useScrollToTop(ref);
  const appState = useRef(AppState.currentState);

  const dispatch = useDispatch();
  const usersData = useSelector((state: RootState) => state.user.usersData);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      axios(`${config.API_URL}/api/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          dispatch(setUserData(response.data));

          const userData = response.data;
          if (userData.name === "") {
            navigation.replace("UserInfo", { isLogin: true });
          }
        })
        .catch(error => {
          console.log("error", error.message);
        })
        .finally(() => setLoading(false));
    };
    getProfileData();
  }, []);

  const getUserLocation = async () => {
    try {
      if (!usersData || Object.keys(usersData).length === 0) {
        // only handle location data if user exists
        return;
      }

      const { location } = store.getState()["location"];
      const previousLocation = location;

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // permission not granted: reset user location in redux store and db
        // only reset location when it's not already done
        if (previousLocation !== null) {
          persistUserLocation(null, null);
          dispatch(resetLocation());
        }

        await AsyncStorage.setItem(
          "distanceFilterEnabled",
          JSON.stringify(false)
        );
        return;
      }

      // permission granted: get current location, compare with stored one and update if neccessary
      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      if (previousLocation !== null) {
        var distance = calculateDistance(
          latitude,
          longitude,
          previousLocation.latitude,
          previousLocation.longitude
        );

        // set new location only if it changed significantly
        if (distance > 0.05) {
          dispatch(updateLocation({ latitude, longitude }));
          persistUserLocation(latitude, longitude);
        }
      } else {
        dispatch(updateLocation({ latitude, longitude }));
        persistUserLocation(latitude, longitude);
      }
    } catch (error) {
      console.error("Error while getting location:", error);
    }
  };

  useEffect(() => {
    // get location permission and data on mount
    const fetchUserLocation = async () => {
      await getUserLocation();
    };

    fetchUserLocation();

    const handleAppStateChange = async (nextAppState: any) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // check for permission and location change when app comes to foreground (handles cases when user changes the permission in phone settings)
        fetchUserLocation();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [usersData]);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await AsyncStorage.removeItem("selectedGenres");
      await AsyncStorage.removeItem("selectedGenders");
      await AsyncStorage.removeItem("distanceValue");
      await AsyncStorage.removeItem("distanceFilterEnabled");
      dispatch(resetLocation());
      dispatch(resetUserData());
    } catch (error) {
      console.error("Error removing stored values: ", error);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

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
          <View>
            <Text style={styles.userName}>
              {usersData.name}, {usersData.age}
            </Text>
            <View style={styles.instaInfo}>
              <Ionicons
                name="logo-instagram"
                size={18}
                color={AppColors.GREY_700}
              />
              <Text style={styles.infoText}>{usersData.contactInfo}</Text>
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
                    usersData.genderType as string as keyof typeof GenderType
                  ]
                }
              </Text>
            </View>
          </View>
          <View>
            <SecondaryButton
              title="Ändern"
              onPress={() => navigation.replace("UserInfo", { isLogin: false })}
            />
          </View>
        </View>
        <Text style={styles.subTextBio}>{usersData.bio}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.genreHeadline}>Deine Top Genres</Text>
          <View style={styles.genres}>
            {usersData.topGenres
              ?.sort((a: GenreData, b: GenreData) =>
                a.name.localeCompare(b.name)
              )
              .map((genre: GenreData, index: number) => (
                <Badge key={index} text={genre.name} />
              ))}
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.genreHeadline}>Deine Top Künstler</Text>
          <View style={styles.artists}>
            {usersData.topArtists?.map((artist: ArtistData, index: number) => (
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
  },
  userName: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
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
    marginTop: 24,
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
