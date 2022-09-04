import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";

import { AppColors } from "../constants/AppColors";
import { RootStackParamList } from "../types";

const DismissKeyboard = ({ children }: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

type Props = NativeStackScreenProps<RootStackParamList, "UserInfo">;

const completeLogin = (navigation: any) => {
  setTimeout(() => navigation.replace("Root"), 500);
};

const submit = (navigation: any) => {
  navigation.goBack();
};

export default function UserInfoScreen({ route, navigation }: Props | any) {
  const [text, onChangeText] = React.useState("");

  const isLogin = route.params.isLogin;
  console.log("isLogin", isLogin);

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.headline}>Deine Daten</Text>
          {!isLogin && (
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={32} color={AppColors.GREY_900} />
            </Pressable>
          )}
        </SafeAreaView>
        <Text style={styles.infoHeadline}>
          Wie lautet dein Instagram-Benutzername?
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="justinbieber"
          placeholderTextColor={AppColors.GREY_500}
          autoCapitalize="none"
        />
        <PrimaryButton
          title="Speichern"
          style={styles.submitButton}
          onPress={() =>
            isLogin ? completeLogin(navigation) : submit(navigation)
          }
        />
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 20,
  },
  safeArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 25,
  },
  headline: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
  },
  infoHeadline: {
    marginLeft: 20,
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
  },
  input: {
    height: 50,
    margin: 20,
    borderColor: AppColors.GREY_300,
    color: AppColors.GREY_900,
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 10,
  },
  submitButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: "90%",
  },
});
