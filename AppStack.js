// App.js
import React from 'react';
import { AppRegistry } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { name as appName } from './app.json';

const App = () => {
  return <StackNavigator />;
};

AppRegistry.registerComponent(appName, () => App);

export default App;
