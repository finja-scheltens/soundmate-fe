import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { AppColors } from "../constants/AppColors";

interface Props {
  text?: string;
  style?: ViewStyle;
  clickable?: boolean; // New prop to control clickability
}

export default function PrimaryButton({ text, clickable = false }: Props) {
  const [clicked, setClicked] = useState(false);

  const handlePress = () => {
    if (clickable) {
      setClicked(!clicked);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={clickable ? 0.8 : 1}>
      <View style={[styles.badge, clicked && styles.clicked]}>
        <Text style={[styles.badgeText, clicked && styles.badgeTextClicked]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: AppColors.GREY_200,
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.GREY_700,
  },
  clicked: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  badgeTextClicked: {
    color: "black",
  },
});
