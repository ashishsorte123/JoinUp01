import { useNavigation } from "@react-navigation/native";
import { Auth, DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewGroupButton from "../components/NewGroupButton";
import UserItem from "../components/UserItem";
import { ChatRoom, ChatRoomUser, User } from "../src/models";

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    DataStore.query(User).then(setUsers);
  }, []);

  const addUserToChatRoom = async (user, chatRoom) => {
    DataStore.save(
      new ChatRoomUser({ 
        user,
        chatRoom 
      }));
  };

  const createChatRoom = async (users) => {
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    if (!dbUser) {
      Alert.alert("There ia an error in creating a group");
      return;
    }

    // create a new chatroom
    const newChatRoomData = { newMessages: 0, Admin: dbUser };

    if (users.length > 1) {
      newChatRoomData.name = "New Group";
      newChatRoomData.imageUri =
        "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/group.jpeg";
    }

    const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

    // connect authenticated user with the chat room

    if (dbUser) {
      await addUserToChatRoom(dbUser, newChatRoom);
    }

    // connect clicked user with the chat room

    await Promise.all(
      users.map((user) => addUserToChatRoom(user, newChatRoom))
    );

    navigation.navigate("ChatRoom", { id: newChatRoom.id });
  };

  const isUserSelected = (user) => {
    return selectedUsers.some((selectedUser) => selectedUser.id === user.id);
  };

  const onUserPress = async (user) => {
    if (isNewGroup) {
      if (isUserSelected(user)) {
        // remove it from selected
        setSelectedUsers(
          selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
        );
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    } else {
      await createChatRoom([user]);
    }
  };

  const saveGroup = async () => {
    await createChatRoom(selectedUsers);
  };

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onPress={() => onUserPress(item)}
            isSelected={isNewGroup ? isUserSelected(item) : undefined}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <NewGroupButton onPress={() => setIsNewGroup(!isNewGroup)} />
        )}
      />

      {isNewGroup && (
        <Pressable style={styles.button} onPress={saveGroup}>
          <Text style={styles.buttonText}>
            Save Group ({selectedUsers.length})
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },

  button: {
    backgroundColor: "#3777f0",
    marginHorizontal: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
