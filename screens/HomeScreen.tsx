import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatRoomItem from "../components/ChatRoomItem";
import chatRoomData from "../assets/dummy-data/ChatRooms";

const chatRoom1 = chatRoomData[0];
const chatRoom2 = chatRoomData[1];

export default function HomeScreen() {
  return (
    <View style={styles.page}>
      <FlatList
        data={chatRoomData}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});
