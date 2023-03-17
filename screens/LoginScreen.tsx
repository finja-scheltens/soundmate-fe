import { ImageBackground, Image, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useEffect, useState } from "react";
import {makeRedirectUri, ResponseType, useAuthRequest} from "expo-auth-session";
import axios, {AxiosResponse} from "axios";
import { useDispatch } from "react-redux";
import * as tokenStore from "../store/actions/token";
import PrimaryButton from "../components/PrimaryButton";
import { AppColors } from "../constants/AppColors";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

class JwtResponse {
  jwtToken: string

  constructor(jwtToken: string) {
    this.jwtToken = jwtToken;
  }
}

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [spotifyAuthCode, setSpotifyAuthCode] = useState("");
  const [backendJwtToken, setBackendJwtToken] = useState("");

  const soundmateRedirectUri = makeRedirectUri();

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
      ],
      usePKCE: false,
      redirectUri: soundmateRedirectUri
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      console.log(response)
      const code = response.params.code;
      setSpotifyAuthCode(code);
    }
  }, [response]);

  useEffect(() => {
    if (spotifyAuthCode) {
      console.log(spotifyAuthCode)
      axios("http://192.168.0.29:8080/api/auth/spotify", {
        method: "POST",
        data: {
          authCode: spotifyAuthCode,
          redirectUri: soundmateRedirectUri
        },
      })
        .then((response:AxiosResponse<JwtResponse>) => {
          console.log(response.data);
          setBackendJwtToken(response.data.jwtToken)
        })
        .catch((error) => {
          console.log("error", error.message);
        });

      navigation.replace("UserInfo", { isLogin: true });

    }
  });

  return (
    <View style={styles.container}>
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
            Lorem ipsum dolar sit amet lorem ipsum dolar sit amet. Lorem ipsum
            dolar sit.
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
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    paddingHorizontal: "6%",
    fontFamily: "Inter-Regular",
  },
});
