import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 5,
  },

  sendAudioContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 15,
    alignSelf: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },

  audioProgressBG: {
    height: 3,
    flex: 1,
    backgroundColor: "lightgrey",
    borderRadius: 5,
    margin: 15,
  },

  audioProgressFG: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3777f0",
    position: "absolute",
    top: -3,
  },
});

export default styles;
