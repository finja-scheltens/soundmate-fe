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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import PrimaryButton from "../components/PrimaryButton";

import { AppColors } from "../constants/AppColors";
import { RootStackParamList } from "../types";

import  config  from "../constants/Config";
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
  const [userBio, onChangeUserBio] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const isLogin = route.params.isLogin;

  async function updateProfile() {
    setUpdateLoading(true);

    const token = await SecureStore.getItemAsync("token");

    axios(`${config.API_URL}/api/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: userName.trim(),
        age: userAge,
        contactInfo: instaName.trim(),
        bio: userBio,
      },
    })
      .then(() => {
        setTimeout(() => navigation.replace("Root"), 500);
      })
      .catch(error => {
        console.log("error", error.message);
      })
      .finally(() => setTimeout(() => setUpdateLoading(false), 500));
  }

  async function submit() {
    if (
      userName.trim() == "" ||
      userAge.trim() == "" ||
      instaName.trim() == "" ||
      userBio.trim() == ""
    ) {
      Alert.alert("Fülle bitte alle Felder aus.");
    } else {
      updateProfile();
    }
  }

  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      axios(`${config.API_URL}/api/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          onChangeUserName(response.data.name);
          onChangeUserAge(response.data.age.toString());
          onChangeInstaName(response.data.contactInfo);
          onChangeUserBio(response.data.bio);
        })
        .catch(error => {
          console.log("error", error.message);
        })
        .finally(() => setLoading(false));
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
          {isLoading && !isLogin && (
            <ActivityIndicator style={styles.loading} />
          )}
          {!isLoading && (
            <View>
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
                Wie heißt du auf Instagram?
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeInstaName}
                value={instaName}
                placeholder="Dein Instagram Username"
                placeholderTextColor={AppColors.GREY_500}
                autoCapitalize="none"
              />
              <Text style={styles.infoHeadline}>
                Was möchtest du über dich erzählen?
              </Text>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                onChangeText={onChangeUserBio}
                value={userBio}
                style={styles.inputMulti}
                placeholder="Steckbrief"
                textAlignVertical="top"
              />
            </View>
          )}
        </KeyboardAwareScrollView>
        <PrimaryButton
          title="Speichern"
          style={styles.submitButton}
          onPress={submit}
          isLoading={updateLoading}
        />
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loading: {
    marginTop: 30,
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
    marginBottom: 10,
  },
  infoHeadline: {
    marginTop: 22,
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
  inputMulti: {
    margin: 20,
    borderColor: AppColors.GREY_300,
    color: AppColors.GREY_900,
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 10,
    minHeight: 100,
    maxHeight: 100,
    paddingTop: 10,
  },
  submitButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: "90%",
  },
});
