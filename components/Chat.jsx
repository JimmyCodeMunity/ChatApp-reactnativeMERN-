import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const Chat = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View>
      <Pressable
      onPress={()=>navigation.navigate("ChatRoom",{
        name:item?.name,
        receiverId:item?._id,
        image:item?.image
      })}
      className="flex-row w-full justify-between items-center border border-1 border-slate-200 border-t-0 border-r-0 border-l-0 py-2">
        <View className="flex-row space-x-4 justify-center items-center">
          <View>
            <Image
              className="h-10 rounded-full w-10"
              source={{ uri: item?.image }}
            />
          </View>
          <View>
            <Text>{item?.name}</Text>
            <Text className="text-sm text-slate-400">Chat with {item.name}</Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-2">
          
          <Pressable className="rounded-md h-6 px-2 justify-center items-center">
            <Icon name="chevron-right" color="black" size={20} />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
