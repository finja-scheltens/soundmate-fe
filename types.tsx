/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IMessage } from "react-native-gifted-chat";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export enum GenderType {
  MALE = "Männlich",
  FEMALE = "Weiblich",
  DIVERSE = "Divers",
}

export type UserData = {
  profilePictureUrl: string;
  name: string;
  age: number;
  genderType: GenderType;
  contactInfo: string;
  bio: string;
  topGenres: [];
  topArtists: [];
  novelFactor: number;
  mainstreamFactor: number;
  diverseFactor: number;
};

export type UserLocation = {
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

export type ArtistData = {
  name: string;
  imageUrl: string;
};

export type GenreData = {
  name: string;
};

export type UserInfoParams = {
  isLogin: boolean;
};

export type DetailParams = {
  profileId: string;
};

export type MatchingInfoParams = {
  matchData: UserData;
  matchingPercentage: number;
};

export type ChatParams = {
  chatId: string;
  name: string;
  profilePictureUrl: string;
  senderProfileId: string;
  recipientProfileId: string;
}

export type RootStackParamList = {
  Login: undefined;
  UserInfo: UserInfoParams;
  Home: undefined;
  Matches: undefined;
  Detail: DetailParams;
  MatchingInfo: MatchingInfoParams;
  ChatList: undefined;
  Chat: ChatParams;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Login: undefined;
  UserInfo: undefined;
  Home: undefined;
  Matches: undefined;
  Detail: undefined;
  MatchingInfo: undefined;
  AppInfo: undefined;
  ChatList: undefined;
  Chat: ChatParams;
};

//For chat funcionalities
export type ChatRoom = {
  chatId: string;
  name: string;
  profilePictureUrl: string;
  senderProfileId: string;
  recipientProfileId: string;
};
export type ChatIdMessages = {
  [chatId: string]: Array<IMessage>;
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
