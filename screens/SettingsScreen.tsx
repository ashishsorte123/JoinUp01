import { View, Text, Pressable } from "react-native";
import React from "react";
import { Auth } from "aws-amplify";

const SettingsScreen = () => {
  const logout = async () => {
    // await DataStore.clear();
    Auth.signOut();
  };

  return (
    <View>
      <Pressable
        onPress={logout}
        style={{
          backgroundColor: "#3777f0",
          height: 50,
          margin: 10,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 50,
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default SettingsScreen;
