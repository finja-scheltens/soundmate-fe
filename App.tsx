import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import tokenReducer from "./store/reducers/token";
import ChatNotification from "./components/ChatNotification";

const rootReducer = combineReducers({
  token: tokenReducer,
});

const store = createStore(rootReducer);

// TODO: use dynamic data
const messageProperties = {
  profileId: "2",
  profileImage:
    "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  userName: "John",
  message: "Hallo test",
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // TODO: don't use one boolean for notification and indicator
  const [newChatMessage, setNewChatMessage] = useState(true);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <Provider store={store}>
            <Navigation
              colorScheme={colorScheme}
              newChatMessage={newChatMessage}
            >
              {newChatMessage && (
                <ChatNotification
                  messageProperties={messageProperties}
                  onDismiss={() => {
                    setNewChatMessage(false);
                  }}
                />
              )}
            </Navigation>
            <StatusBar />
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
