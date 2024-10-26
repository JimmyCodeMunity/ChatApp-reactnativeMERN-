import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "react-native-feather";
import { AuthContext } from "../context/AuthContext";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BottomNavigator from "./BottomNavigator";
import ChatScreen from "../screens/ChatScreen";
import PeopleScreen from "../screens/PeopleScreen";
import RequestChatScreen from "../screens/RequestChatScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { isLoggedIn } = useContext(AuthContext);
  let initialRoute = "Landing"; // Default route
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? initialRoute : "Splash"}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false, presentation: "modal" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={BottomNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="People"
              component={PeopleScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Request"
              component={RequestChatScreen}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoomScreen}
              options={{ headerShown: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
