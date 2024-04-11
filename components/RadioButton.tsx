import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  TouchableOpacity,
} from "react-native";
import { AppColors } from "../constants/AppColors";

interface Props {
  style?: ViewStyle;
  selected: boolean;
  label: string;
  onPress: () => void;
}

export default function RadioButton({
  onPress,
  style,
  selected,
  label,
}: Props) {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
      <View style={[styles.radioButtonCircle, style]}>
        {selected ? <View style={styles.radioButtonInner} /> : null}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  radioButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  radioButtonCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: AppColors.SECONDARY,
  },
  radioButtonInner: {
    height: 14,
    width: 14,
    borderRadius: 50,
    backgroundColor: AppColors.SECONDARY,
  },
});
