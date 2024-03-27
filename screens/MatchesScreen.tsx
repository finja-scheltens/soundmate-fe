import * as React from "react";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";

import { GenderType, GenreData, RootStackParamList } from "../types";
import { AppColors } from "../constants/AppColors";
import config from "../constants/Config";
import { RootState } from "../store/store";

import MatchItem from "../components/MatchItem";
import FilterModal from "../components/FilterModal";

const numColumns = 2;
type Props = NativeStackScreenProps<RootStackParamList, "Matches">;

type Match = {
  key: string;
  empty: boolean;
  name: string;
  age: number;
  profilePictureUrl?: string;
  profileId: string;
  genderType: GenderType;
  topGenres: GenreData[];
};

const formatData = (data: Match[], numColumns: number) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({
      key: `blank-${numberOfElementsLastRow}`,
      empty: true,
      name: "",
      age: 0,
      genderType: GenderType.DIVERSE,
      profileId: "",
      topGenres: [],
    });
    numberOfElementsLastRow++;
  }

  return data;
};

const wait = (timeout: number | undefined) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function MatchesScreen({ navigation }: Props) {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const usersData = useSelector((state: RootState) => state.user.usersData);
  const [originalMatches, setOriginalMatches] = useState<Match[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [numberOfMatches, setNumberOfMatches] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<GenderType[]>([]);

  useEffect(() => {
    setLoading(true);
    getMatches();
  }, []);

  useEffect(() => {
    loadSavedFilters();
  }, [originalMatches]);

  const loadSavedFilters = async () => {
    try {
      const selectedGenresString = await AsyncStorage.getItem("selectedGenres");
      const selectedGendersString = await AsyncStorage.getItem(
        "selectedGenders"
      );

      if (selectedGenresString && selectedGendersString) {
        const savedSelectedGenres = JSON.parse(selectedGenresString);
        const savedSelectedGenders = JSON.parse(selectedGendersString);
        setSelectedGenres(savedSelectedGenres);
        setSelectedGenders(savedSelectedGenders);

        applyFilters(savedSelectedGenres, savedSelectedGenders);
      } else {
        setNumberOfMatches(originalMatches.length);
        setMatches(originalMatches);
      }
    } catch (error) {
      console.error("Error loading filters: ", error);
    }
  };

  const saveSelectedFilters = async (
    selectedGenres: string[],
    selectedGenders: GenderType[]
  ) => {
    setSelectedGenres(selectedGenres);
    setSelectedGenders(selectedGenders);
    try {
      await AsyncStorage.setItem(
        "selectedGenres",
        JSON.stringify(selectedGenres)
      );
      await AsyncStorage.setItem(
        "selectedGenders",
        JSON.stringify(selectedGenders)
      );
    } catch (error) {
      console.error("Error saving filters: ", error);
    }
  };

  const applyFilters = (
    selectedGenres: string[],
    selectedGenders: GenderType[]
  ) => {
    saveSelectedFilters(selectedGenres, selectedGenders);

    const filteredMatches = originalMatches.filter(match => {
      const genderMatch =
        selectedGenders.length === 0 ||
        selectedGenders.includes(match.genderType);

      const genreMatch =
        selectedGenres.length === 0 ||
        match.topGenres.some(genre => selectedGenres.includes(genre.name));

      return genderMatch && genreMatch;
    });

    setNumberOfMatches(filteredMatches.length);
    setMatches(filteredMatches);
  };

  const getMatches = async () => {
    const token = await SecureStore.getItemAsync("token");

    axios(`${config.API_URL}/api/match`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        response.data.length
          ? setOriginalMatches(response.data)
          : setOriginalMatches([]);
      })
      .catch(error => {
        console.log("error", error.message);
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 500)
      );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMatches();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <FilterModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        usersData={usersData}
        savedSelectedGenres={selectedGenres}
        savedSelectedGenders={selectedGenders}
        onApplyFilters={applyFilters}
      />
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.headline}>Matches</Text>
        <TouchableOpacity
          hitSlop={15}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          {selectedGenders.length || selectedGenres.length ? (
            <View style={styles.outerFilterBadge}>
              <View style={styles.innerFilterBadge}></View>
            </View>
          ) : null}
          <Entypo name="sound-mix" size={26} color={AppColors.GREY_900} />
        </TouchableOpacity>
      </SafeAreaView>
      {isLoading ? (
        <ActivityIndicator style={styles.defaultContainer} />
      ) : (
        <View style={styles.defaultContainer}>
          {matches.length ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ref={ref}
              data={formatData(matches, numColumns)}
              renderItem={({ item }: { item: Match }) => (
                <TouchableHighlight
                  style={styles.touchable}
                  underlayColor="transparent"
                  disabled={item.empty}
                  onPress={() =>
                    navigation.push("Detail", { profileId: item.profileId })
                  }
                >
                  <MatchItem
                    userName={item.name}
                    userAge={item.age}
                    imageSource={
                      item.profilePictureUrl
                        ? { uri: item.profilePictureUrl }
                        : require("../assets/images/avatar2.png")
                    }
                    style={item.empty ? styles.itemInvisible : styles.matchItem}
                  />
                </TouchableHighlight>
              )}
              numColumns={numColumns}
              style={styles.matches}
              ListHeaderComponent={() => (
                <Text style={styles.numberMatches}>
                  {numberOfMatches} Match(es)
                </Text>
              )}
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.noMatchesContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <Image
                source={require("../assets/images/empty-state.png")}
                style={styles.noMatchesImage}
              />
              <Text style={styles.noMatchesHeadline}>Keine Matches</Text>

              {originalMatches.length &&
              (selectedGenders.length || selectedGenres.length) ? (
                <Text style={styles.noMatchesText}>
                  Oh-oh, leider gibt es keine passenden Matches zu deinen
                  Filtereinstellungen.
                </Text>
              ) : (
                <Text style={styles.noMatchesText}>
                  Hoppala, leider konnten wir keine passenden Matches finden.
                  Komm später wieder oder lade die Seite neu!
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 20,
  },
  safeArea: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    marginHorizontal: 20,
  },
  defaultContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  touchable: {
    flex: 1,
  },
  headline: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
    marginBottom: 6,
  },
  itemInvisible: {
    opacity: 0,
  },
  numberMatches: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.GREY_500,
    marginLeft: 10,
    marginBottom: 10,
  },
  matches: {
    paddingHorizontal: 12,
  },
  matchItem: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
  noMatchesContainer: {
    paddingTop: 100,
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  noMatchesImage: {
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
  noMatchesHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
    marginTop: 20,
  },
  noMatchesText: {
    marginTop: 10,
    marginHorizontal: 34,
    fontFamily: "Inter-Regular",
    color: AppColors.GREY_900,
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
  },
  outerFilterBadge: {
    position: "absolute",
    top: -4,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 50,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  innerFilterBadge: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: AppColors.PRIMARY,
  },
});
