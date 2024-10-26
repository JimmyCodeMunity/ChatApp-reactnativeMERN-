import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const SplashScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text className="text-orange-500 font-bold tracking-wider text-2xl">Talkative</Text>
      <Text className="tracking-wider font-semibold">Wanna Talk?</Text>
      <View className="absolute bottom-10 justify-center items-center w-full">
        <TouchableOpacity
        onPress={()=>navigation.navigate('Login')}
        className="bg-orange-500 h-12 w-60 rounded-xl justify-center items-center">
          <Text className="text-white text-xl">Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
