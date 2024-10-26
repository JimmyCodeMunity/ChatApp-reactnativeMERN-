import {
    Alert,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Entypo";
import axios from "axios";
import { BASE_URL } from "../config";

const RequestChatScreen = ({ navigation, route }) => {
  const { userdata } = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  const name = route?.params?.name;
  const receiverId = route?.params?.receiverId;
  const userId = userdata?.userdata?._id; 


  const sendMessage = async()=>{
    console.log("userid", userId);
    console.log()
    try {
        const userData = {
            senderId:userId,
            receiverId: receiverId,
            message: message,
        }

        const response = await axios.post(`${BASE_URL}/sendrequest`,userData)
        if(response.status === 200){
            setMessage("")
            Alert.alert("request sent.Awaiting user to accept")
        }
        
    } catch (error) {
        Alert.alert("Failed to send request", error.message)
        console.log(error)
        
    }
  }

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <View className="flex-row items-center justify-between space-x-5">
            <View>
              <Pressable onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={30} color="black" />
              </Pressable>
            </View>
            <View>
              <Text className="text-xl font-semibold">
                {route?.params?.name}
              </Text>
            </View>
          </View>
        );
      },
    });
  });
  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      <ScrollView></ScrollView>
      <View className="bg-white space-x-4 py-8 w-full px-6 flex-row items-center justify-between">
        <View>
            <Icon name="emoji-happy" size={30} color="orange"/>
        </View>
        <View>
          <TextInput
          value={message}
          onChangeText={(text)=>setMessage(text)}
            placeholder="enter text"
            className="flex-1 h-8 px-4 border border-1 w-60 border-slate-400 rounded-full"
          />
        </View>
        <View>
            <Pressable
            onPress={sendMessage}
            className="h-8 w-12 rounded-3xl justify-center items-center bg-orange-500"
            //   onPress={() => {
            //     setMessage([...message, { message: message, sender: userid }]);
            //   }}
            >
              <Text className="text-white">Send</Text>
            </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RequestChatScreen;

const styles = StyleSheet.create({});
