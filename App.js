import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { AppRegistry, AppState } from "react-native";
import { name as appName } from "./app.json";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const Stack = createStackNavigator();

async function copyDBtoAsset() {
  try {
    const dbAsset = Asset.fromModule(require("./assets/pnlpDB.db"));
    const dbUri = `${FileSystem.documentDirectory}SQLite/pnlpDB.db`;

   // force copy
    //await FileSystem.downloadAsync(dbAsset.uri, dbUri);
    // Ensure the SQLite directory exists
    const dirInfo = await FileSystem.getInfoAsync(
      `${FileSystem.documentDirectory}SQLite`
    );
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`
      );
    }

    // Check if the database file already exists
    const fileInfo = await FileSystem.getInfoAsync(dbUri);
    if (!fileInfo.exists) {
      await FileSystem.downloadAsync(dbAsset.uri, dbUri);
      console.log("Database copied successfully.");
      await AsyncStorage.setItem("isDBCopied", "true"); // Set the flag
    } else {
      console.log("Database already exists an!.");
    }
  } catch (error) {
    console.error('Error copying database:', error);
  }
}
const checkAndCopyDB = async () => {
  try {
    const isDBCopied = await AsyncStorage.getItem("isDBCopied");
    if (!isDBCopied) {
      await copyDBtoAsset();
    }
  } catch (error) {
    console.error("Error checking database copy status e:", error);
  }
};

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    //Force copy DB
    //copyDBtoAsset(); 
    checkAndCopyDB();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log("App has come to the foreground!");
        //checkAndCopyDB();
        // Place your logic for app entering foreground here
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("App has gone to the background!");
        //checkAndCopyDB();
        // Place your logic for app entering background here
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => App);
export default App;
