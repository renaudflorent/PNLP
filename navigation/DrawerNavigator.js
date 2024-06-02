// DrawerNavigator.js
import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import DrawerHeader from "../components/DrawerHeader";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import SendSMS from "../screens/SendSMS";
import { View } from "react-native";
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Details" component={DetailsScreen} />
      <Drawer.Screen name="Sms" component={SendSMS} />
    </Drawer.Navigator>
  );
};

const DrawerContent = ({ navigation }) => {
    return (
      <DrawerContentScrollView {...navigation}>
        <DrawerHeader />
        <DrawerItem
          label="Home"
          onPress={() => navigation.navigate('Home')}
        />
        <DrawerItem
          label="Envoyer un SMS"
          onPress={() => navigation.navigate('Sms')}
        />
        {/* Additional Drawer Items */}
        {/* Add more DrawerItems as needed */}
      </DrawerContentScrollView>
    );
  };
  

export default DrawerNavigator;
