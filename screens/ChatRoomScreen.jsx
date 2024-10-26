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
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Entypo";
import axios from "axios";
import { BASE_URL } from "../config";
import { useSocketContext } from "../context/SocketContext";

const ChatRoomScreen = ({ navigation, route }) => {
  const { userdata } = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  const name = route?.params?.name;
  const receiverId = route?.params?.receiverId;
  const userId = userdata?.userdata?._id;
  const { socket } = useSocketContext();

  const sendMessage = async (senderId, receiverId) => {
    console.log("sender", senderId);
    console.log();
    try {
    //   const response = await axios.post(`${BASE_URL}/sendmessage`, {
    //     senderId,
    //     receiverId,
    //     message,
    //   });
      socket.emit("sendMessage", { senderId: userId, receiverId, message });
      setMessage("");
      setTimeout(() => {
        getMessages();
      }, 100);
    } catch (error) {
      Alert.alert("Failed to send request", error.message);
      console.log(error);
    }
  };

  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = route?.params?.receiverId;
      const response = await axios.get(`${BASE_URL}/getmessages`, {
        params: {
          senderId,
          receiverId,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to get messages", error.message);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  console.log("messages", messages);

  const listenToMessages = () => {
    const { socket } = useSocketContext();
    useEffect(() => {
      socket?.on("newMessage", (newMessage) => {
        newMessage.shouldShake = true;
        setMessages([...messages, newMessage]);
      });

      return () => {
        socket?.off("newMessage");
      };
    });
  };

  listenToMessages();

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

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
    <ScrollView className="w-full py-2">
      {messages.map((item, index) => {
        const isSender = item?.senderId?._id === userId;
        return (
          <View
            key={index}
            className={`w-full flex flex-row ${
              isSender ? "justify-end" : "justify-start"
            } px-4 py-2`}
          >
            <Pressable
              className={`${
                isSender
                  ? "bg-black text-white rounded-l-md rounded-tr-md px-4 py-2"
                  : "bg-red-500 rounded-r-md rounded-tl-md px-4 py-2"
              } max-w-[80%]`}
            >
              <Text className="text-white">{item?.message}</Text>
              <Text className="text-sm text-slate-400">
                {formatTime(item?.timeStamp)}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
    <View className="bg-white space-x-4 py-4 w-full px-6 flex-row items-center justify-between">
      <Icon name="emoji-happy" size={30} color="orange" />
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Enter text"
        className="flex-1 h-10 px-4 border border-slate-400 rounded-full"
      />
      <Pressable
        onPress={() => sendMessage(userId, route?.params.receiverId)}
        className="h-10 w-16 rounded-full justify-center items-center bg-orange-500"
      >
        <Text className="text-white">Send</Text>
      </Pressable>
    </View>
  </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({});
