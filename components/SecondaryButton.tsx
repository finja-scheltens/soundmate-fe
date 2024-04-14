import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { AppColors } from "../constants/AppColors";

type SecondaryButtonProps = {
  title?: string;
  style?: ViewStyle;
  onPress: () => void;
};

export default function SecondaryButton({
  title,
  style,
  onPress,
}: SecondaryButtonProps) {
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
