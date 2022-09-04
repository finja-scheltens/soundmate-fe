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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

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
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function MatchesScreen({ navigation }: Props) {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    //TODO: api call
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headline}>Matches</Text>
      </SafeAreaView>
      {users ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ref={ref}
          data={formatData(users, numColumns)}
          renderItem={({ item }: any) => (
            <TouchableHighlight
              style={styles.touchable}
              underlayColor="transparent"
              onPress={() => navigation.push("Detail", item)}
            >
              <MatchItem
                userName={item.userName}
                imageSource={{ uri: "https://picsum.photos/200" }}
                style={item.empty ? styles.itemInvisible : styles.matchItem}
              />
            </TouchableHighlight>
          )}
          numColumns={numColumns}
          style={styles.matches}
          ListHeaderComponent={() => (
            <Text style={styles.numberMatches}>{users.length} Vorschläge</Text>
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
              Leider konnten wir keine passenden Matches finden. Probiere es
              später erneut oder lade die Seite neu!
            </Text>
          </View>
        </ScrollView>
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
