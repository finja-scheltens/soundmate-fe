import React, { useEffect, useState } from "react";
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
  selected?: boolean;
  onPress?: () => void;
}

export default function Badge({ text, selected, onPress }: Props) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (selected !== undefined) {
      setClicked(selected);
    }
  }, [selected]);

  const handlePress = () => {
    setClicked(!clicked);
    onPress && onPress();
  };

  return (
    <TouchableOpacity
      onPress={onPress ? handlePress : undefined}
      activeOpacity={onPress ? 0.8 : 1}
    >
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
