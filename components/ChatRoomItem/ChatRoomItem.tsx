import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { User } from "../../src/models";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoomUser } from "../../src/models";

export default function ChatRoomItem({ chatRoom }) {
  const [users, setUsers] = useState<User[]>([]); // all users in this chatroom
  const [user, setUser] = useState<User | null>(null); // the display user

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatRoom.id === chatRoom.id)
        .map((chatRoomUser) => chatRoomUser.user);

      // setUsers(fetchedUsers);

      const authUser = await Auth.currentAuthenticatedUser();
      setUser(
        fetchedUsers.find((user) => user.id !== authUser.attributes.sub) || null
      );
      console.log(fetchedUsers);
    };
    fetchUsers();
  }, []);

  const onPress = () => {
    // console.warn("pressed on", user.name);
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={{
          uri: user.imageUri,
        }}
        style={styles.image}
      />
      {!!chatRoom.newMessages && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
        </View>
      )}
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.text}>{chatRoom.lastMessage?.createdAt}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {chatRoom.lastMessage?.content}
        </Text>
      </View>
    </Pressable>
  );
}
