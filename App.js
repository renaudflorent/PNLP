// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './navigation/DrawerNavigator';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

const App = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};
AppRegistry.registerComponent(appName, () => App);
export default App;
