import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { AppColors } from "../constants/AppColors";
interface Props {
  onPress: () => void;
  title?: string;
  style?: ViewStyle;
}

export default function SecondaryButton({ onPress, title, style }: Props) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    paddingHorizontal: 26,
    borderRadius: 8,
    borderColor: AppColors.PRIMARY,
    borderWidth: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    color: AppColors.PRIMARY,
    fontFamily: "Inter-Medium",
  },
});
