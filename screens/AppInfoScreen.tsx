import { Image, Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { AppColors } from "../constants/AppColors";

export default function AppInfoScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Image
        source={require("../assets/images/thank-you.png")}
        style={styles.thanksImage}
      />
      <Text style={styles.text}>
        Danke, dass du unsere App testest. Um unsere Forschungsfrage zu
        beantworten, bitten wir dich am Ende der Testphase, unsere Umfrage
        auszufüllen. Dafür kommen wir nochmal mit ein paar Informationen auf
        dich zu. Happy Matching!
      </Text>
      {/* <PrimaryButton
        title="Zur Umfrage"
        style={styles.surveyButton}
        onPress={() => {
          Linking.openURL("https://forms.gle/hbbFwenaYP74RRvd6");
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  thanksImage: {
    width: "100%",
    height: "15%",
    resizeMode: "contain",
    marginTop: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  text: {
    marginTop: 50,
    marginHorizontal: 20,
    fontFamily: "Inter-Regular",
    color: AppColors.GREY_900,
    fontSize: 16,
    lineHeight: 20,
  },
  surveyButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
});
