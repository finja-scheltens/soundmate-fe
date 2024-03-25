/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ColorSchemeName,
  Image,
  View,
  Text,
  TouchableHighlight,
} from "react-native";

import { AppColors } from "../constants/AppColors";

import useColorScheme from "../hooks/useColorScheme";
// import ModalScreen from '../screens/ModalScreen';
// import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from "../screens/HomeScreen";
import MatchesScreen from "../screens/MatchesScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import AppInfoScreen from "../screens/AppInfoScreen";
import LoginScreen from "../screens/LoginScreen";
import DetailScreen from "../screens/DetailScreen";
import UserInfoScreen from "../screens/UserInfoScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";

import * as SecureStore from "expo-secure-store";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function Header() {
  return (
    <TouchableHighlight
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          style={{ width: 35, height: 35, borderRadius: 50 }}
          source={{
            uri: "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
        />
        <Text
          style={{
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Name
        </Text>
      </View>
    </TouchableHighlight>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route, navigation }) => ({
          headerTitle: props => <Header />,
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerBlurEffect: "light",
        })}
      />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "white" },
        tabBarLabel: () => {
          return null;
        },
        tabBarActiveTintColor: AppColors.GREY_900,
        tabBarInactiveTintColor: AppColors.GREY_900,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? "play" : "play-outline"} />
          ),
        }}
      />
      {/* <BottomTab.Screen
          name="AppInfo"
          component={AppInfoScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={
                  focused ? "information-circle" : "information-circle-outline"
                }
              />
            ),
          }}
        /> */}
      <BottomTab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
}) {
  return <Ionicons size={35} style={{ marginBottom: -3 }} {...props} />;
}
