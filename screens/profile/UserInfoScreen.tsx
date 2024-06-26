import * as React from "react";
import { useEffect, useState } from "react";
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
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { GenderType, RootStackParamList } from "../../types";
import { AppColors } from "../../constants/AppColors";
import config from "../../constants/Config";

import PrimaryButton from "../../components/PrimaryButton";
import RadioButton from "../../components/RadioButton";

const DismissKeyboard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

type UserInfoProps = {
  navigation: NativeStackScreenProps<
    RootStackParamList,
    "UserInfo"
  >["navigation"];
  route: NativeStackScreenProps<RootStackParamList, "UserInfo">["route"];
};

export default function UserInfoScreen({ route, navigation }: UserInfoProps) {
  const ref = React.useRef(null);
  const [instaName, onChangeInstaName] = useState("");
  const [userName, onChangeUserName] = useState("");
  const [userAge, onChangeUserAge] = useState("");
  const [genderType, onChangeGenderType] = useState("");
  const [userBio, onChangeUserBio] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { isLogin } = route.params;

  const updateProfile = async () => {
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
        genderType: genderType,
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
  };

  const submit = async () => {
    if (
      userName.trim() == "" ||
      userAge.trim() == "" ||
      genderType === null ||
      genderType.trim() == "" ||
      instaName.trim() == "" ||
      userBio.trim() == ""
    ) {
      Alert.alert("Fülle bitte alle Felder aus.");
    } else {
      updateProfile();
    }
  };

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
          onChangeGenderType(response.data.genderType);
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.headline}>Deine Daten</Text>
        {!isLogin && (
          <Pressable onPress={() => navigation.replace("Root")}>
            <Ionicons name="close" size={32} color={AppColors.GREY_900} />
          </Pressable>
        )}
      </SafeAreaView>
      <KeyboardAwareScrollView ref={ref} style={styles.scrollContainer}>
        <DismissKeyboard>
          <View>
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
                  Mit welchem Geschlecht identifizierst du dich?
                </Text>
                {Object.entries(GenderType).map(([key, value], index) => (
                  <RadioButton
                    key={index}
                    label={value}
                    selected={genderType === key}
                    onPress={() => onChangeGenderType(key)}
                  />
                ))}
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
                <Text style={styles.bioExamplesText}>
                  Zum Beispiel: Welches Lied bringt dich immer zum Tanzen oder
                  welches singst du lautstark mit?
                </Text>
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  onChangeText={onChangeUserBio}
                  value={userBio}
                  style={styles.inputMulti}
                  placeholder="Steckbrief"
                  placeholderTextColor={AppColors.GREY_500}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>
        </DismissKeyboard>
      </KeyboardAwareScrollView>
      <PrimaryButton
        title="Speichern"
        style={styles.submitButton}
        onPress={submit}
        isLoading={updateLoading}
      />
    </View>
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
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  safeArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingTop: 25,
    paddingHorizontal: 20,
    shadowColor: AppColors.GREY_900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
    paddingBottom: Platform.OS === "android" ? 14 : 0,
  },
  headline: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: AppColors.GREY_900,
  },
  infoHeadline: {
    marginTop: 36,
    marginBottom: 10,
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
  },
  input: {
    height: 50,
    borderColor: AppColors.GREY_300,
    color: AppColors.GREY_900,
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 10,
  },
  bioExamplesText: {
    color: AppColors.GREY_700,
    lineHeight: 20,
  },
  inputMulti: {
    borderColor: AppColors.GREY_300,
    color: AppColors.GREY_900,
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 100,
    maxHeight: 100,
    padding: 10,
    marginTop: 20,
    marginBottom: 130,
    lineHeight: 20,
  },
  submitButton: {
    position: "absolute",
    bottom: 45,
    alignSelf: "center",
    width: "90%",
    shadowColor: AppColors.GREY_900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
