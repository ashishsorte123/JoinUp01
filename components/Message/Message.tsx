import {
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { User } from "../../src/models";
import { Auth, DataStore, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native";
import AudioPlayer from "../AudioPlayer";
import { Ionicons } from "@expo/vector-icons";
import { Message as MessageModal } from "../../src/models";
import MessageReply from "../MessageReply";
import { useActionSheet } from "@expo/react-native-action-sheet";

const Message = (props) => {
  const { setAsMessageReply, message: propMessage } = props;
  const [message, setMessage] = useState<MessageModal>(propMessage);
  const [user, setUser] = useState<User | undefined>();
  const [isMe, setIsMe] = useState<boolean | null>(null);
  const [soundURI, setSoundURI] = useState<any>(null);
  const { width } = useWindowDimensions();
  const [repliedTo, setRepliedTo] = useState<MessageModal | undefined>(
    undefined
  );
  const { showActionSheetWithOptions } = useActionSheet();
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    setMessage(propMessage);
  }, [propMessage]);

  useEffect(() => {
    if (message?.replyToMessageID) {
      DataStore.query(MessageModal, message.replyToMessageID).then(
        setRepliedTo
      );
    }
  }, [message]);

  useEffect(() => {
    const subscription = DataStore.observe(MessageModal, message.id).subscribe(
      (msg) => {
        // console.log(msg.model, msg.opType, msg.element);
        if (msg.model === MessageModal) {
          if (msg.opType === "UPDATE") {
            setMessage((message) => ({ ...message, ...msg.element }));
          } else if (msg.opType === "DELETE") {
            setIsDeleted(true);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setAsRead();
  }, [isMe, message]);

  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio).then(setSoundURI);
    }
  }, [message]);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    };
    checkIfMe();
  }, [user]);

  const setAsRead = async () => {
    if (isMe === false && message.status !== "READ") {
      await DataStore.save(
        MessageModal.copyOf(message, (updated) => {
          updated.status = "READ";
        })
      );
    }
  };

  const deleteMessage = async () => {
    await DataStore.delete(message);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete the message",
      [
        {
          text: "Delete",
          onPress: deleteMessage,
          style: "destructive",
        },
        {
          text: "Cancel",
        },
      ]
    );
  };

  const onActionPress = (index) => {
    if (index === 0) {
      setAsMessageReply();
    } else if (index === 1) {
      if (isMe) {
        confirmDelete();
      } else {
        Alert.alert("Cant't perform action", "This is not your message");
      }
    }
  };

  const openActionMenu = () => {
    const options = ["Reply", "Delete", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      onActionPress
    );
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <Pressable
      onLongPress={openActionMenu}
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? "75%" : "auto" },
      ]}
    >
      {repliedTo && <MessageReply message={repliedTo} />}

      <View style={styles.row}>
        {message.image && (
          <View style={{ marginBottom: message.content ? 10 : 0 }}>
            <S3Image
              imgKey={message.image}
              style={{ width: width * 0.65, aspectRatio: 4 / 3 }}
              resizeMode="contain"
            />
          </View>
        )}

        {soundURI && <AudioPlayer soundURI={soundURI} />}

        {!!message.content && (
          <Text style={{ color: isMe ? "black" : "white" }}>
            {isDeleted ? "message deleted" : message.content}
          </Text>
        )}

        {isMe && !!message.status && message.status !== "SENT" && (
          <Ionicons
            name={
              message.status === "DELIVERED" ? "checkmark" : "checkmark-done"
            }
            size={16}
            color="grey"
            style={{ marginHorizontal: 5 }}
          />
        )}
      </View>
    </Pressable>
  );
};

export default Message;
