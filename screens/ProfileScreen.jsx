import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const ProfileScreen = ({navigation}) => {
  const {logout} = useContext(AuthContext)

  const handleLogout = () =>{
    logout();
  }


  
  return (
    <View className="justify-center items-center flex-1">
      <Text>ProfileScreen</Text>
      <TouchableOpacity
      onPress={handleLogout}
      className="bg-black h-12 w-40 rounded-xl justify-center items-center">
        <Text className="text-white text-xl">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})