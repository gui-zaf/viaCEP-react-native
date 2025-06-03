import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { theme } from "./theme/theme";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { Fragment } from "react";

export default function App() {
  return (
    <SafeAreaProvider
      style={{ backgroundColor: theme.colors.background }}
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <PaperProvider
        theme={{
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            surface: theme.colors.surface,
            error: theme.colors.error,
          },
        }}
      >
        <Fragment>
          <StatusBar style="auto" />
          <AppNavigator />
        </Fragment>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
