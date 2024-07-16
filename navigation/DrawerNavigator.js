import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import the MaterialIcons icon set from Expo
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import DrawerHeader from "../components/DrawerHeader";
import HomeScreen from "../screens/HomeScreen";
import LocationComponent from "../screens/LocationComponent";
import SendSMS from "../screens/SendSMS";
import DetailsScreen from "../screens/DetailsScreen";
import Setting from "../screens/Setting";

// Screen components for each drawer item

// Custom drawer content component
const CustomDrawerContent = ({ navigation }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (item) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [item]: !prevExpandedItems[item],
    }));

    // Automatically collapse other expanded items
    Object.keys(expandedItems).forEach((key) => {
      if (key !== item && expandedItems[key]) {
        setExpandedItems((prevExpandedItems) => ({
          ...prevExpandedItems,
          [key]: false,
        }));
      }
    });
  };
  const isExpanded = (item) => {
    return expandedItems[item];
  };
  const handleLogout = () => {
    // Add logout logic here
    // For example, navigate to the login screen or clear user data
    navigation.navigate("Welcome"); // Assuming 'Welcome' is your login screen
  };
  return (
    <DrawerContentScrollView>
      {/* Standard drawer items with icons */}
      <DrawerHeader />
      <DrawerItem
        label="Page d'acceuil"
        icon={({ focused, color, size }) => (
          <Icon name="home" size={size} color={"blue"} />
        )}
        onPress={() => navigation.navigate("Page d'acceuil")}
      />

      {/* Expandable drawer item */}
      <DrawerItem
        label="Formulaires (OG)"
        icon={({ color, size }) => (
          <MaterialIcons
            name={
              isExpanded("formulaire")
                ? "keyboard-arrow-up"
                : "keyboard-arrow-down"
            }
            size={size}
            color={"blue"}
          />
        )}
        onPress={() => toggleExpand("formulaire")}
      />
      {isExpanded("formulaire") && (
        <View style={styles.expandedContent}>
          <Text style={styles.title}>Formation</Text>
          <DrawerItem
            label="FDF - Central"
            style={styles.title}
            icon={({ focused, color, size }) => (
              <Icon name="form" size={size} color={"blue"} />
            )}
            onPress={() => {
              console.log("Setting 1 pressed");
            }}
          />

          <DrawerItem
            label="FDF - District"
            style={styles.title}
            icon={({ focused, color, size }) => (
              <Icon name="form" size={size} color={"blue"} />
            )}
            onPress={() => console.log("Setting 2 pressed")}
          />
          <Text style={styles.title}>Authentification</Text>
          <DrawerItem
            label="Authentification"
            style={styles.title}
            icon={({ focused, color, size }) => (
              <Icon name="form" size={size} color={"blue"} />
            )}
            onPress={() => navigation.navigate("Authentification")}
          />
          <Text style={styles.title}>Logistique</Text>
          <DrawerItem
            label="Envoi vers site"
            style={styles.title}
            icon={({ focused, color, size }) => (
              <Icon name="form" size={size} color={"blue"} />
            )}
            onPress={() => navigation.navigate("Authentification")}
          />
          <Text style={styles.title}>Distribution</Text>
          <DrawerItem
            label="Distribution"
            style={styles.title}
            icon={({ focused, color, size }) => (
              <Icon name="form" size={size} color={"blue"} />
            )}
            onPress={() => navigation.navigate("Authentification")}
          />
        </View>
      )}

      <DrawerItem
        label="Envoyer SMS"
        icon={({ focused, color, size }) => (
          <FontAwesome5 name="sms" size={size} color={"blue"} />
        )}
        onPress={() => navigation.navigate("Sms")}
      />
      <DrawerItem
        label="Paramètre"
        icon={({ focused, color, size }) => (
          <Icon name="setting" size={size} color={"blue"} />
        )}
        onPress={() => navigation.navigate("Paramètres")}
      />
      <View>
        {/* Log Out Button */}
        <Button title="Deconnexion" onPress={handleLogout} />
      </View>
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "blue",
        drawerInactiveTintColor: "black",
        drawerActiveBackgroundColor: "lightblue",
      }}
    >
      <Drawer.Screen name="Page d'acceuil" component={HomeScreen} />
      <Drawer.Screen name="LocationComponant" component={LocationComponent} />
      <Drawer.Screen name="Sms" component={SendSMS} />
      <Drawer.Screen name="Authentification" component={DetailsScreen} />
      <Drawer.Screen name="Paramètres" component={Setting} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  expandedContent: {
    marginLeft: 16,
  },
  subItem: {
    marginLeft: 5,
  },
  mainItem: {
    marginLeft: 0,
  },
  title: {
    marginLeft: 55,
    color: "blue",
    fontWeight: "bold",
  },
  subtitle: {
    marginLeft: 55,
    fontWeight: "bold",
  },
});

export default DrawerNavigator;
