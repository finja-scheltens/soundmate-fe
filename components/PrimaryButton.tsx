import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { AppColors } from "../constants/AppColors";
interface Props {
  onPress: () => void;
  title?: string;
  style?: ViewStyle;
  isLoading?: boolean;
}

export default function PrimaryButton({
  onPress,
  title,
  style,
  isLoading,
}: Props) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
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
