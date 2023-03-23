/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import Ionicons from "@expo/vector-icons/Ionicons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

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

import * as SecureStore from "expo-secure-store";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const [isSignedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    const checkUser = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) setSignedIn(true);
    };
    checkUser();
  }, []);

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isSignedIn ? <SignedInNavigator /> : <RootNavigator />}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function SignedInNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false, animationTypeForReplace: "pop" }}
      />
      <Stack.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
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
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
            />
          ),
        })}
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
      <BottomTab.Screen
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
