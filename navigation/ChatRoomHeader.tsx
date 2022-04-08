import { View, Text, Image, useWindowDimensions } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

const ChatRoomHeader = (props) => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: width - 25,
        padding: 10,
        alignItems: "center",
        marginLeft: -35,
      }}
    >
      <Image
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg",
        }}
        style={{ width: 30, height: 30, borderRadius: 15 }}
      />
      <Text
        style={{
          flex: 1,
          marginLeft: 10,
          fontWeight: "bold",
        }}
      >
        {props.children}
      </Text>
      <Feather
        name="camera"
        size={24}
        color="black"
        style={{ marginHorizontal: 10 }}
      />
      <Feather
        name="edit-2"
        size={24}
        color="black"
        style={{ marginHorizontal: 10 }}
      />
    </View>
  );
};

export default ChatRoomHeader;
