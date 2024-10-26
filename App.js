import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import StackNavigator from "./navigation/StackNavigator";
import { SocketContextProvider } from "./context/SocketContext";

export default function App() {
  return (
    <AuthProvider>
      <SocketContextProvider>
        <StackNavigator />
      </SocketContextProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
