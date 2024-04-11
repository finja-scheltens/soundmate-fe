import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppColors } from "../constants/AppColors";

type IndicatorProps = {
  style?: ViewStyle;
};

export default function Indicator({ style }: IndicatorProps) {
  return (
    <View style={[style, styles.outerIndicator]}>
      <View style={styles.innerIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerIndicator: {
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
