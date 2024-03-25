/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
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
// import ModalScreen from '../screens/ModalScreen';
// import NotFoundScreen from '../screens/NotFoundScreen';
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

export default function Navigation({
  colorScheme,
  newChatMessage,
  children,
}: {
  colorScheme: ColorSchemeName;
  newChatMessage: boolean;
  children: ReactNode;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator newChatMessage={newChatMessage} />
      {children}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO: we need the name here
type HeaderProps = {
  profileId: string;
};

function Header({ profileId }: HeaderProps) {
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

function RootNavigator({ newChatMessage }: { newChatMessage: boolean }) {
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
        {() => <BottomTabNavigator newChatMessage={newChatMessage} />}
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
          headerTitle: props => <Header profileId={route.params.profileId} />,
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
