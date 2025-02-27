import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";

const LoginScreen = ({ navigation }) => {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("jimmy@gmail.com");
  const [password, setPassword] = useState("123456");
  const [dataload, setDataload] = useState(false);

  const handleLogin = async () => {
    setDataload(true);
    try {
      if (!email || !password) {
        Alert.alert("All fields are required");
        return;
      }
      await login(email, password);
      Alert.alert("Login successful");
      navigation.navigate("Home");
      setDataload(false);
    } catch (error) {
      Alert.alert("Login failed", error.message);
      setDataload(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="w-full px-4 space-y-4">
        <Text className="text-3xl font-semibold">Sign In</Text>

        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="#868686"
        />

        <TextInput
          className="border border-t-0 h-12 border-l-0 border-r-0 border-red-300"
          placeholder="enter password"
          placeholderTextColor="#868686"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {!dataload ? (
          <TouchableOpacity
            onPress={handleLogin}
            // onPress={()=>navigation.navigate('home')}
            className="bg-red-500 h-12 rounded-2xl justify-center items-center"
          >
            <Text className="text-white text-xl font-semibold">Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
            // onPress={()=>navigation.navigate('home')}
            className="bg-red-500 h-12 rounded-2xl justify-center items-center"
          >
            <Text className="text-white text-xl font-semibold">
              <ActivityIndicator size="large" color="white" />
            </Text>
          </TouchableOpacity>
        )}

        <Pressable
          onPress={() => navigation.navigate("Register")}
          className="w-full"
        >
          <Text className="text-slate-600">
            Already have an account?
            <Text className="text-red-400"> Create Account</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
