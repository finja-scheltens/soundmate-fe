import React from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type MatchItemProps = {
  imageSource: ImageSourcePropType;
  userName: string;
  userAge: number;
  style?: ViewStyle;
};

export default function MatchItem({
  imageSource,
  userName,
  userAge,
  style,
}: MatchItemProps) {
  return (
    <View style={[styles.itemContainer, style]}>
      <View style={styles.innerContainer}>
        <ImageBackground source={imageSource} style={styles.itemImage} />
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.0)",
            "rgba(0,0,0,0.07)",
            "rgba(0,0,0,0.2)",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.6)",
            "rgba(0,0,0,0.7)",
            "rgba(0,0,0,0.8)",
          ]}
          style={styles.gradient}
        >
          <Text style={styles.userName}>
            {userName}, {userAge}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    width: 150,
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemImage: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  gradient: {
    alignSelf: "flex-end",
    width: "100%",
    justifyContent: "center",
  },
  userName: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "white",
    marginLeft: 12,
    paddingVertical: 12,
    paddingTop: 20,
  },
});
