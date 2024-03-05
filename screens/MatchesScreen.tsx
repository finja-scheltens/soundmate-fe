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
import { useDispatch, useSelector } from "react-redux";
import { useScrollToTop } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";

import { GenreData, RootStackParamList } from "../types";
import { AppColors } from "../constants/AppColors";
import config from "../constants/Config";
import { RootState } from "../store/store";

import MatchItem from "../components/MatchItem";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import Badge from "../components/Badge";

const numColumns = 2;
type Props = NativeStackScreenProps<RootStackParamList, "Matches">;

type Match = {
  key: string;
  empty: boolean;
  name: string;
  age: number;
  profilePictureUrl?: string;
  profileId: string;
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
      profileId: "",
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
  const [matches, setMatches] = useState<Match[]>([]);
  const [numberOfMatches, setNumberOfMatches] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  async function getMatches() {
    const token = await SecureStore.getItemAsync("token");

    axios(`${config.API_URL}/api/match`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setNumberOfMatches(response.data.length);
        setMatches(response.data);
      })
      .catch(error => {
        console.log("error", error.message);
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 500)
      );
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMatches();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getMatches();
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaProvider style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <SafeAreaView style={styles.modalView}>
            <Text style={styles.filterHeadline}>Filter</Text>
            <View style={styles.filterContainer}>
              <View>
                <Text style={styles.genreHeadline}>Deine Top Genres</Text>
                <View style={styles.genres}>
                  {usersData.topGenres?.map(
                    (genre: GenreData, index: number) => (
                      <Badge key={index} text={genre.name} clickable={true} />
                    )
                  )}
                </View>
              </View>
            </View>
            <View style={styles.filterButtons}>
              <SecondaryButton
                title="Abbrechen"
                style={{ flex: 1 }}
                onPress={() => {
                  setModalVisible(false);
                }}
              />
              <PrimaryButton
                title="Anwenden"
                style={{ flex: 1 }}
                onPress={() => {}}
              />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.headline}>Matches</Text>
        <TouchableOpacity
          hitSlop={15}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
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
              <Text style={styles.noMatchesText}>
                Leider konnten wir keine passenden Matches finden. Komm später
                wieder oder lade die Seite neu!
              </Text>
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 140,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: -20,
  },
  filterHeadline: {
    fontFamily: "Inter-Bold",
    textAlign: "center",
    fontSize: 22,
  },
  filterContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 40,
  },
  genreHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
    marginBottom: 10,
  },
  genres: {
    marginTop: 12,
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 14,
  },
});
