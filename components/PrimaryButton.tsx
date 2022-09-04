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
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: AppColors.PRIMARY,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Inter-SemiBold",
  },
});
