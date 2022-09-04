import * as React from "react";
import { StyleSheet, Image, View, ScrollView } from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { Text } from "../components/Themed";
import { AppColors } from "../constants/AppColors";
import { RootTabScreenProps } from "../types";
import { Key } from "react";
import Badge from "../components/Badge";
import ListItem from "../components/ListItem";
import PrimaryButton from "../components/PrimaryButton";

const user = require("../data/user.json");

export default function HomeScreen({ navigation }: any) {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <ScrollView ref={ref} style={styles.scrollContainer}>
      <View style={styles.profileHeaderContainer}>
        <Image
          source={require("../assets/images/profile.jpeg")}
          style={styles.profileHeaderImage}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.userData}>
          <View>
            <Text style={styles.userName}>Malin</Text>
            <Text style={styles.eMail}>fin.ja@hotmail.com</Text>
          </View>
          <View>
            <PrimaryButton
              title="Edit"
              onPress={() => navigation.push("UserInfo", { isLogin: false })}
              style={{ paddingVertical: 10, paddingHorizontal: 28 }}
            />
          </View>
        </View>
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
    paddingBottom: 20,
  },
});
