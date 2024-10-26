import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const PeopleScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const { userdata } = useContext(AuthContext);
  const userid = userdata.userdata._id;

  console.log("userdata", userdata.userdata._id);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userid}`);
      const data = await response.data;
      setUsers(data);
      console.log("users", data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const User = ({item}) => {
    return (
      <View className="flex-row w-full px-4 justify-between items-center border border-1 border-slate-200 border-t-0 border-r-0 border-l-0 py-2">
        <View className="flex-row space-x-4 justify-center items-center">
            <View>
            <Image
            className="h-10 rounded-full w-10"
            source={{uri:item?.image}}
          />
            </View>
            <View>
                <Text>{item?.name}</Text>
                <Text>{item?.email}</Text>
            </View>
          
        </View>
        <View>
          <Pressable
          onPress={()=>navigation.navigate('Request',{
            name:item?.name,
            receiverId:item?._id
          })}
          className=" rounded-md justify-center items-center">
            <Text className="text-white text-xl text-orange-500">Chat</Text>
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="w-full my-6 justify-center items-center">
        <Text>People Using Talkative</Text>
      </View>
      <View className="w-full px-4">
        <FlatList
          data={users}
          renderItem={({ item }) => <User item={item} key={item?._id} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({});
