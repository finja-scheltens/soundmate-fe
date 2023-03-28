import { ImageBackground, Image, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useEffect, useState, useCallback } from "react";
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import axios, { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import { AppColors } from "../constants/AppColors";

import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

class JwtResponse {
  jwtToken: string;

  constructor(jwtToken: string) {
    this.jwtToken = jwtToken;
  }
}

async function saveToken(value: string) {
  await SecureStore.setItemAsync("token", value);
}

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [spotifyAuthCode, setSpotifyAuthCode] = useState("");
  const [backendJwtToken, setBackendJwtToken] = useState("");
  const [appIsReady, setAppIsReady] = useState(false);

  const soundmateRedirectUri = makeRedirectUri();
  useEffect(() => {
    const checkUser = async () => {
      await SplashScreen.preventAutoHideAsync();
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        navigation.push("Root");
        navigation.reset({
          index: 0,
          routes: [{ name: "Root" }],
        });
      }
      setAppIsReady(true);
    };
    checkUser();
  }, []);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: "83bf8873115447d893923470b70d209a",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
        " user-library-read",
      ],
      usePKCE: false,
      redirectUri: soundmateRedirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params.code;
      setSpotifyAuthCode(code);
    }
  }, [response]);

  useEffect(() => {
    if (spotifyAuthCode) {
      axios("http://82.165.77.87:8080/api/auth/spotify", {
        method: "POST",
        data: {
          authCode: spotifyAuthCode,
          redirectUri: soundmateRedirectUri,
        },
      })
        .then((response: AxiosResponse<JwtResponse>) => {
          const jwtToken = response.data.jwtToken;
          setBackendJwtToken(jwtToken);
          saveToken(jwtToken);
        })
        .catch(error => {
          console.log("error", error.message);
        });

      navigation.replace("UserInfo", { isLogin: true });
    }
  }, [spotifyAuthCode]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <ImageBackground
        source={require("../assets/images/login-background.png")}
        resizeMode="stretch"
        style={styles.background}
      />
      <View style={styles.innerContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Soundmate</Text>
          <Text style={styles.text}>
            Entdecke deine musikalischen Seelenverwandten auf SoundMate.
            Verbinde dich mit neuen Freunden basierend auf deiner Spotify
            Bibliothek.
          </Text>
        </View>
        <PrimaryButton
          onPress={() => {
            promptAsync();
          }}
          title="Mit Spotify verbinden"
          style={{ width: "90%" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: AppColors.GREY_900,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingTop: "28%",
    paddingBottom: "22%",
    width: "100%",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "40%",
    resizeMode: "contain",
  },
  textContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontFamily: "Inter-ExtraBold",
    color: "white",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    paddingHorizontal: "6%",
    fontFamily: "Inter-Regular",
    color: "white",
  },
});
