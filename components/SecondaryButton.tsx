import { Pressable, Text, StyleSheet } from "react-native";
import { AppColors } from "../constants/AppColors";
interface Props {
  onPress: () => void;
  title?: string;
  style?: any;
}

export default function PrimaryButton({ onPress, title, style }: Props) {
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
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 8,
    // elevation: 3,
    borderColor: AppColors.GREY_500,
    borderWidth: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    color: AppColors.GREY_900,
    fontFamily: "Inter-Medium",
  },
});
