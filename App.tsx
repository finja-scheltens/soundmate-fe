import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import store, { RootState } from "./store/store";
import ChatNotification from "./components/ChatNotification";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // Needed for StompJS to work
  const TextEncodingPolyfill = require("text-encoding");
  Object.assign(global, {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
  });

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {isLoadingComplete && (
          <>
            <StatusBar />
            <NavigationWithNotification colorScheme={colorScheme} />
          </>
        )}
      </SafeAreaProvider>
    </Provider>
  );

  function NavigationWithNotification({ colorScheme }: { colorScheme: any }) {
    const newMessage = useSelector(
      (state: RootState) => state.WebSocketClient.newChatMesssage
    );
    let messageProperties = {
      profileId: "",
      profileImage: "",
      userName: "",
      message: "",
    };
    if (Object.keys(newMessage).length !== 0) {
      messageProperties = {
        profileId: newMessage.user._id,
        profileImage: newMessage.user.avatar,
        userName: newMessage.user.name,
        message: newMessage.text,
      };
    }

    return (
      <>
        <Navigation colorScheme={colorScheme}>
          {Object.keys(newMessage).length !== 0 && (
            <ChatNotification
              messageProperties={messageProperties}
              onDismiss={() =>
                store.dispatch({ type: "NEW_MESSAGE_RECEIVED", payload: {} })
              }
            />
          )}
        </Navigation>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
