import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';


const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  return (
   <Tab.Navigator
   screenOptions={{
    tabBarActiveTintColor:"orange",
   }}
   >
    <Tab.Screen
    options={{
      headerShown:false,
      tabBarLabel:"Chats",
      tabBarIcon:({ focused,color,size }) => (
        <Icon name="chat" size={26} color={focused? "orange":"gray"} />
      ),
    }}
    name="Chats" component={ChatScreen}/>
    <Tab.Screen
    options={{
      headerShown:false,
      tabBarLabel:"Profile",
      tabBarIcon:({ focused,color,size }) => (
        <Icon name="cog" size={26} color={focused? "orange":"gray"} />
      ),
    }}
    name="Profile" component={ProfileScreen}/>
    
   </Tab.Navigator>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});