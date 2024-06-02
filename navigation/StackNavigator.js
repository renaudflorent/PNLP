// navigation/StackNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import { Pressable , Text} from "react-native";

const Stack = createStackNavigator();


const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <Pressable
                onPress={() => alert('Header button pressed!')}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: 'blue' }}>Info</Text>
              </Pressable>
            ),
            contentStyle: { backgroundColor: 'red' }, // Set content style background color to red
          })}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            headerStyle: { backgroundColor: "#53BDA5" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
