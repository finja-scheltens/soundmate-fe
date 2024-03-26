import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  VictoryChart,
  VictoryArea,
  VictoryTheme,
  VictoryPolarAxis,
} from "victory-native";

import { RootStackParamList } from "../types";
import { AppColors } from "../constants/AppColors";
import { Text } from "../components/Themed";
import MatchRadarChart from "../components/MatchRadarChart";

type MatchingInfoProps = {
  navigation: NativeStackScreenProps<
    RootStackParamList,
    "MatchingInfo"
  >["navigation"];
};

// TODO: dynamisch
const match = {
  name: "Hans Peter Müller",
  profilePictureUrl:
    "https://www.santander.com/content/dam/santander-com/es/stories/cabecera/2021/bancaresponsable/im-storie-liderazgo-femenino-una-apuesta-por-un-futuro-mas-igualitario-movil.jpg.transform/rendition-sm/image.jpg",
};

// TODO: dynamisch (store)
const user = {
  name: "Hans Peter Müller",
  profilePictureUrl:
    "https://www.santander.com/content/dam/santander-com/es/stories/cabecera/2021/bancaresponsable/im-storie-liderazgo-femenino-una-apuesta-por-un-futuro-mas-igualitario-movil.jpg.transform/rendition-sm/image.jpg",
};

export default function MatchingInfoScreen({ navigation }: MatchingInfoProps) {
  const ref = React.useRef(null);

  return (
    <ScrollView ref={ref} style={styles.scrollContainer}>
      <SafeAreaView>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={AppColors.GREY_900} />
        </Pressable>
        <Text style={styles.matchingHeadline}>✨ It's a match ✨</Text>
        <View style={styles.matchingContainer}>
          <View style={styles.userInfoContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  user.profilePictureUrl
                    ? { uri: user.profilePictureUrl }
                    : require("../assets/images/avatar2.png")
                }
                style={styles.userImages}
              />
            </View>
            <View style={styles.userNameContainer}>
              <Text style={styles.userNameText}>Du</Text>
            </View>
          </View>
          <View style={styles.matchingPercentageContainer}>
            {/* TODO: dynamisch */}
            <Text style={styles.matchingPercentageText}>80%</Text>
            <Image
              source={require("../assets/images/match-percentage-bg.png")}
              style={styles.matchingPercentageImage}
            />
          </View>
          <View style={styles.matchInfoContainer}>
            <View style={[styles.matchNameContainer]}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {match.name}
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={
                  match.profilePictureUrl
                    ? { uri: match.profilePictureUrl }
                    : require("../assets/images/avatar2.png")
                }
                style={styles.userImages}
              />
            </View>
          </View>
        </View>
        {/* TODO: dynamisch */}
        <MatchRadarChart />
        <TouchableOpacity
          onPress={() => {}}
          style={styles.explanationContainer}
        >
          <Text style={styles.explanation}>Was bedeutet das? 🤔</Text>
          <View style={styles.underline} />
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
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
  matchingHeadline: {
    marginTop: 20,
    color: AppColors.PRIMARY,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  matchingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    marginTop: 20,
    height: 260,
  },
  userInfoContainer: {
    position: "absolute",
    left: 0,
    transform: [{ rotate: "-4deg" }],
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  matchInfoContainer: {
    position: "absolute",
    right: 0,
    transform: [{ rotate: "10deg" }],
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  imageContainer: {
    overflow: "hidden",
    borderRadius: 10,
    width: 160,
    height: 190,
  },
  userImages: {
    height: "100%",
    width: "100%",
  },
  userNameContainer: {
    backgroundColor: AppColors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  matchNameContainer: {
    backgroundColor: AppColors.SECONDARY,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  userNameText: {
    fontWeight: "600",
    maxWidth: 100,
  },
  matchingPercentageContainer: {
    position: "absolute",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  matchingPercentageText: {
    position: "absolute",
    zIndex: 100,
    fontSize: 28,
    fontWeight: "700",
    color: "#F2C94C",
    shadowColor: "#D4E5ED",
    shadowOffset: {
      width: -2,
      height: 2.5,
    },
    shadowOpacity: 1,
    shadowRadius: 0.8,
  },
  matchingPercentageImage: {
    height: 95,
    width: 95,
    resizeMode: "contain",
    marginLeft: -4,
  },
  explanationContainer: {
    display: "flex",
    alignItems: "center",
  },
  explanation: {
    color: AppColors.GREY_500,
    textAlign: "center",
  },
  underline: {
    borderTopColor: AppColors.GREY_500,
    borderTopWidth: 1,
    opacity: 0.5,
    width: 146,
    marginTop: 4,
  },
});
