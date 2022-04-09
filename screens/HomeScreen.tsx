import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ChatRoomItem from "../components/ChatRoomItem";
import chatRoomData from "../assets/dummy-data/ChatRooms";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoom } from "../src/models";
import { ChatRoomUser } from "../src/models";

export default function HomeScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter(
          (chatRoomUser) => chatRoomUser.user.id === userData.attributes.sub
        )
        .map((chatRoomUser) => chatRoomUser.chatRoom);
      console.log(chatRooms);
      setChatRooms(chatRooms);
    };
    fetchChatRooms();
  }, []);

  const logout = async () => {
    // await DataStore.clear();
    Auth.signOut();
  };

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        onPress={logout}
        style={{
          backgroundColor: "#3777f0",
          height: 50,
          margin: 10,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});
