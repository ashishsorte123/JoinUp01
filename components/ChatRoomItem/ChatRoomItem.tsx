import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { Message, User } from "../../src/models";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoomUser } from "../../src/models";
import moment from "moment";

export default function ChatRoomItem({ chatRoom }) {
  const [users, setUsers] = useState<User[]>([]); // all users in this chatroom
  const [user, setUser] = useState<User | null>(null); // the display user
  const [lastMessage, setLastMessage] = useState<Message | undefined>();

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
      // console.log(fetchedUsers);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!chatRoom.chatRoomLastMessageId) {
      return;
    }
    DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(
      setLastMessage
    );
  }, []);

  const onPress = () => {
    // console.warn("pressed on", user.name);
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  const time = moment(lastMessage?.createdAt).from(moment());

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={{
          uri: chatRoom.imageUri || user.imageUri,
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
          <Text style={styles.name}>{chatRoom.name || user.name}</Text>
          <Text style={styles.text}>{time}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {lastMessage?.content}
        </Text>
      </View>
    </Pressable>
  );
}
