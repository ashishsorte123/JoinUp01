import { Amplify, Auth, DataStore, Hub } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import config from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import { LogBox } from "react-native";
import { useEffect } from "react";
import { Message } from "./src/models";

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

function App() {
  LogBox.ignoreAllLogs();
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Create listner
    console.log("registering listner");
    const listner = Hub.listen("datastore", async (hubData) => {
      const { event, data } = hubData.payload;

      if (event === "networkStatus") {
        console.log(`User has a network connection: ${data.active}`);
      }
      if (
        event === "outboxMutationProcessed" &&
        data.model === Message &&
        !["DELIVERED", "READ"].includes(data.element.status)
      ) {
        if (data.model === Message) {
          // set the message status to delivered
          DataStore.save(
            Message.copyOf(data.element, (updated) => {
              updated.status = "DELIVERED";
            })
          );
        }
      }
    });

    // Remove listener
    return () => listner();
  }, []);

  // Auth.currentAuthenticatedUser().then(console.log);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
