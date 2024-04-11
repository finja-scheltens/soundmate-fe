import {
  Image,
  Text,
  View,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { AppColors } from "../../constants/AppColors";

type ListItemProps = {
  imageSource: ImageSourcePropType;
  text?: string;
};

export default function ListItem({ imageSource, text }: ListItemProps) {
  return (
    <View style={styles.itemContainer}>
      <Image source={imageSource} style={styles.itemImage} />
      <Text style={styles.itemText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemImage: {
    borderRadius: 100,
    width: 58,
    height: 58,
    resizeMode: "cover",
    borderColor: AppColors.GREY_200,
    borderWidth: 1,
  },
  itemText: {
    marginLeft: 12,
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: AppColors.GREY_900,
  },
});
