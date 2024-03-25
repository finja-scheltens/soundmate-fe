import React from "react";
import { View, StyleSheet } from "react-native";
import { AppColors } from "../constants/AppColors";

export default function Indicator() {
  return (
    <View style={styles.outerIndicator}>
      <View style={styles.innerIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerIndicator: {
    position: "absolute",
    top: -3,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 50,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  innerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: AppColors.PRIMARY,
  },
});
