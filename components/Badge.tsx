import { View, Text, StyleSheet } from "react-native";
import { AppColors } from "../constants/AppColors";
interface Props {
  text?: string;
  style?: any;
}

export default function PrimaryButton({ text, style }: Props) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: AppColors.GREY_200,
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.GREY_900,
  },
});
