/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Login: {
            screens: {
              LoginScreen: "login",
            },
          },
          UserInfo: {
            screens: {
              UserInfoScreen: "userinfo",
            },
          },
          Detail: {
            screens: {
              DetailScreen: "detail",
            },
          },
          MatchingInfo: {
            screens: {
              MatchingInfoScreen: "matchinginfo",
            },
          },
          Home: {
            screens: {
              HomeScreen: "one",
            },
          },
          Matches: {
            screens: {
              MatchesScreen: "two",
            },
          },
          ChatList: {
            screens: {
              ChatListScreen: "three",
            },
          },
          Chat: {
            screens: {
              ChatScreen: "chat",
            },
          },
          // AppInfo: {
          //   screens: {
          //     AppInfoScreen: "three",
          //   },
          // },
        },
      },
      // Modal: 'modal',
      // NotFound: '*',
    },
  },
};

export default linking;
