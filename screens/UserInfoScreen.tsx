import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";

import { AppColors } from "../constants/AppColors";
import { RootStackParamList } from "../types";

import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

const DismissKeyboard = ({ children }: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

type Props = NativeStackScreenProps<RootStackParamList, "UserInfo">;

export default function UserInfoScreen({ route, navigation }: Props | any) {
  const ref = React.useRef(null);

  const [instaName, onChangeInstaName] = useState("");
  const [userName, onChangeUserName] = useState("");
  const [userAge, onChangeUserAge] = useState("");

  const isLogin = route.params.isLogin;

  async function updateProfile() {
    const token = await SecureStore.getItemAsync("token");

    axios("http://192.168.178.26:8080/api/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: userName,
        age: userAge,
        contactInfo: instaName,
      },
    })
      .then(() => {
        setTimeout(() => navigation.replace("Root"), 500);
      })
      .catch(error => {
        console.log("error", error.message);
      });
  }

  async function submit() {
    if (userName == "" || userAge == "" || instaName == "") {
      Alert.alert("Fülle bitte alle Felder aus.");
    } else {
      updateProfile();
    }
  }

  useEffect(() => {
    const getProfileData = async () => {
      const token = await SecureStore.getItemAsync("token");

      axios("http://192.168.178.26:8080/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          onChangeUserName(response.data.name);
          onChangeUserAge(response.data.age.toString());
          onChangeInstaName(response.data.contactInfo);
        })
        .catch(error => {
          console.log("error", error.message);
        });
    };
    if (!isLogin) getProfileData();
  }, []);

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <KeyboardAwareScrollView ref={ref} style={styles.scrollContainer}>
          <SafeAreaView style={styles.safeArea}>
            <Text style={styles.headline}>Deine Daten</Text>
            {!isLogin && (
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={32} color={AppColors.GREY_900} />
              </Pressable>
            )}
          </SafeAreaView>

          <Text style={styles.infoHeadline}>Wie heißt du?</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeUserName}
            value={userName}
            placeholder="Dein Name"
            placeholderTextColor={AppColors.GREY_500}
          />

          <Text style={styles.infoHeadline}>Wie alt bist du?</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeUserAge}
            value={userAge}
            placeholder="Dein Alter"
            placeholderTextColor={AppColors.GREY_500}
            autoCapitalize="none"
            keyboardType="number-pad"
          />

          <Text style={styles.infoHeadline}>
            Wie lautet dein Instagram-Benutzername?
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeInstaName}
            value={instaName}
            placeholder="Dein Instagram Username"
            placeholderTextColor={AppColors.GREY_500}
            autoCapitalize="none"
          />
        </KeyboardAwareScrollView>
        <PrimaryButton
          title="Speichern"
          style={styles.submitButton}
          onPress={submit}
        />
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
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
    marginBottom: 46,
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
