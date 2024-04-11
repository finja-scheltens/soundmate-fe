import Ionicons from "@expo/vector-icons/Ionicons";
import React, { ReactNode } from "react";

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
import HomeScreen from "../screens/HomeScreen";
import MatchesScreen from "../screens/MatchesScreen";
import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import LoginScreen from "../screens/LoginScreen";
import DetailScreen from "../screens/DetailScreen";
import UserInfoScreen from "../screens/UserInfoScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";

import Indicator from "../components/Indicator";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

export default function Navigation({
  colorScheme,
  children,
}: {
  colorScheme: ColorSchemeName;
  children: ReactNode;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
      {children}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

type HeaderProps = {
  chatId: string;
  name: string;
  profilePictureUrl: string;
};

function Header({ name, profilePictureUrl }: HeaderProps) {
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
            uri: profilePictureUrl,
          }}
        />
        <Text
          style={{
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {name}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

function RootNavigator() {
  const newMessage = useSelector(
    (state: RootState) => state.WebSocketClient.newChatMesssage
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      >
        {() => (
          <BottomTabNavigator
            newChatMessage={Object.keys(newMessage).length !== 0}
          />
        )}
      </Stack.Screen>
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
          headerTitle: (props) => (
            <Header
              chatId={route.params.chatId}
              name={route.params.name}
              profilePictureUrl={route.params.profilePictureUrl}
            />
          ),
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

function BottomTabNavigator({ newChatMessage }: { newChatMessage: boolean }) {
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
        options={() => ({
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ position: "relative" }}>
                <TabBarIcon
                  name={focused ? "chatbubbles" : "chatbubbles-outline"}
                />
                {newChatMessage && <Indicator />}
              </View>
            );
          },
        })}
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
