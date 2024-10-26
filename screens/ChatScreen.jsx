import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Image } from "react-native";
import axios from "axios";
import { BASE_URL } from "../config";
import Chat from "../components/Chat";

const ChatScreen = ({ navigation }) => {
  const [options, setOptions] = useState(["Chats"]);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const { userdata } = useContext(AuthContext);
  const userId = userdata?.userdata?._id;

  const getRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getrequests/${userId}`);

      const data = response.data;
      setRequests(data);
      console.log("requests", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const chooseOption = (option) => {
    if (options.includes(option)) {
      setOptions(options.filter((c) => c !== option));
    } else {
      setOptions([...options, option]);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const response = await axios.post(`${BASE_URL}/acceptrequests`, {
        userId: userId,
        requestId: requestId,
      });

      if (response.status === 200) {
        await getRequests();
      }
    } catch (error) {
      console.error("Failed to accept request", error.message);
    }
  };

  const getFriends = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/friends/${userId}`);
      const data = await response.data;
      setChats(data);
      console.log("chats", data);
    } catch (error) {
      console.error("Failed to get friends", error.message);
    }
  };
  useEffect(() => {
    getRequests();
    getFriends();
  }, [userId]);
  return (
    <SafeAreaView className="flex-1">
      <View className="my-8 flex-row w-full px-4 justify-between items-center">
        <View>
          <Image
            source={{ uri: userdata?.userdata?.image }}
            className="h-12 w-12 border border-1 border-slate-500 rounded-full"
          />
        </View>
        <View>
          <Text className="text-xl">Chats</Text>
        </View>
        <View>
          <Pressable onPress={() => navigation.navigate("People")}>
            <Icon name="home" size={30} />
          </Pressable>
        </View>
      </View>

      {/* requests */}
      <Pressable className="w-full justify-between items-center px-5 flex-row">
        <View>
          <Text className="text-xl">Chats</Text>
        </View>
        <View>
          <Icon name="chevron-down" size={30} color="gray" />
        </View>
      </Pressable>

      <View className="w-full px-5">
        {chats.map((item, index) => {
          return <Chat item={item} />;
        })}
      </View>
      <Pressable className="w-full justify-between items-center px-5 flex-row">
        <View>
          <Text className="text-xl">Requests</Text>
        </View>
        <View>
          <Icon name="chevron-down" size={30} color="gray" />
        </View>
      </Pressable>

      

      <View className="w-full px-5">
        {/* {options?.includes("Requests") && ( */}
        <View>
          <Text>Check out all the requests</Text>

          {requests.map((item, index) => {
            return (
              <View className="flex-row w-full justify-between items-center border border-1 border-slate-200 border-t-0 border-r-0 border-l-0 py-2">
                <View className="flex-row space-x-4 justify-center items-center">
                  <View>
                    <Image
                      className="h-10 rounded-full w-10"
                      source={{ uri: item?.from?.image }}
                    />
                  </View>
                  <View>
                    <Text>{item?.from?.name}</Text>
                    <Text>{item?.messages}</Text>
                  </View>
                </View>
                <View className="flex-row items-center space-x-2">
                  <Pressable
                    onPress={() => acceptRequest(item?.from?._id)}
                    className="bg-orange-500 rounded-md h-6 px-2 justify-center items-center"
                  >
                    <Text className="text-white text-md">Accept</Text>
                  </Pressable>
                  <Pressable className="bg-red-500 rounded-md h-6 px-2 justify-center items-center">
                    <Icon name="trash-can" color="white" size={20} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
        {/* )} */}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
