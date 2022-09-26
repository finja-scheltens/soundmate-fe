import { ImageBackground, Image, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useEffect, useState } from "react";
import { exchangeCodeAsync, ResponseType, useAuthRequest, makeRedirectUri } from "expo-auth-session";
import axios from "axios";
import { useDispatch } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import { AppColors } from "../constants/AppColors";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const state = "23w4rgf7izjfggt6i6jr34wt987lig"

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [authCode, setAuthCode] = useState('');
  const [tokenResponse, setTokenResponse] = useState({});
  const [codeVerifier, setCodeVerifier] = useState('');

  const [request, response, promptAsync] =
      useAuthRequest(
          {
            responseType: ResponseType.Code,
            clientId: '83bf8873115447d893923470b70d209a',
            scopes: [
              'user-read-currently-playing',
              'user-read-recently-played',
              'user-read-playback-state',
              'user-top-read',
              'user-modify-playback-state',
              'streaming',
              'user-read-email',
              'user-read-private',
            ],
            usePKCE: true,
            redirectUri: makeRedirectUri(),
            state: state,
          },
          discovery,
      );

  useEffect(() => {
    if (response?.type === 'success') {
      console.log("spotify request success")
      if (response.params.state === state) {
        console.log("state param correct")
        const {code} = response.params;
        setAuthCode(code);
      } else {
        // TODO: error
      }
    }
    console.log(request);
    if(request != null){
      console.log("codeverifier: " + request.codeVerifier);
      setCodeVerifier(request.codeVerifier? request.codeVerifier : '');
    }
  }, [response]);

  useEffect(() => {
    if (authCode) {
      console.log("authcode: " +  authCode)
      console.log("codeverifier: " + codeVerifier);
      const tokenResultPromise = async () => {
        console.log("async method started");
        const tokenResult = await exchangeCodeAsync(
            {
              code: authCode,
              redirectUri: makeRedirectUri(),
              clientId: '83bf8873115447d893923470b70d209a',
              extraParams: {
                code_verifier: codeVerifier ? codeVerifier : ''
              },
            },
            {
              tokenEndpoint: discovery.tokenEndpoint
            }
        );
        setTokenResponse(tokenResult);
      }

      tokenResultPromise().catch(() => console.log("exchange code failed"));
    }
  });

  useEffect(() => {
    if (Object.keys(tokenResponse).length != 0) {
      console.log(tokenResponse)
      axios.post('http://10.0.2.2:8080/register', tokenResponse).then((response) => {
        console.log(response);
        if(response.status != 200){
          console.log(response);
        }
      }).catch(()=> console.log("Promise Rejected"));
    }
  })

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
          title={"Connect with Spotify"}
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
