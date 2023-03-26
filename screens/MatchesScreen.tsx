import * as React from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

import MatchItem from "../components/MatchItem";
import { AppColors } from "../constants/AppColors";

import { useScrollToTop } from "@react-navigation/native";

const users = require("../data/users.json");
const numColumns = 2;
type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

const formatData = (
  data: { key: string; empty: boolean }[],
  numColumns: number
) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
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
  const [matches, setMatches] = useState<any>([]);
  const [numberOfMatches, setNumberOfMatches] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  async function getMatches() {
    const token = await SecureStore.getItemAsync("token");

    axios("http://82.165.77.87:8080/api/match", {
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
      <SafeAreaView>
        <Text style={styles.headline}>Matches</Text>
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
              renderItem={({ item }: any) => (
                <TouchableHighlight
                  style={styles.touchable}
                  underlayColor="transparent"
                  onPress={() => navigation.push("Detail", item.profileId)}
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
              contentContainerStyle={{ alignItems: "center" }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View style={styles.noMatchesContainer}>
                <Image
                  source={require("../assets/images/empty-state.png")}
                  style={styles.noMatchesImage}
                />
                <Text style={styles.noMatchesHeadline}>Keine Matches</Text>
                <Text style={styles.noMatchesText}>
                  Leider konnten wir keine passenden Matches finden. Komm später
                  wieder oder lade die Seite neu!
                </Text>
              </View>
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
    marginTop: 25,
    marginLeft: 20,
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
    alignItems: "center",
  },
  noMatchesImage: {
    height: "85%",
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
});
