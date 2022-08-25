import * as React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MatchItem from "../components/MatchItem";

import { useScrollToTop } from "@react-navigation/native";
import { AppColors } from "../constants/AppColors";

const users = require("../data/users.json");

const numColumns = 2;

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

const renderItem = ({ item }: any) => {
  return (
    <MatchItem
      userName={item.userName}
      imageSource={{ uri: "https://picsum.photos/200" }}
      style={item.empty ? styles.itemInvisible : styles.matchItem}
    />
  );
};

export default function MatchesScreen() {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headline}>Matches</Text>
      </SafeAreaView>
      <FlatList
        ref={ref}
        data={formatData(users, numColumns)}
        renderItem={renderItem}
        numColumns={numColumns}
        style={styles.matches}
        ListHeaderComponent={() => (
          <Text style={styles.numberMatches}>{users.length} Vorschläge</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 20,
  },
  headline: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
    marginTop: 25,
    marginLeft: 20,
  },
  itemInvisible: {
    backgroundColor: "red",
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
});
