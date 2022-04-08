import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    padding: 10,
  },

  inputContainer: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    justifyContent: "center",
    borderColor: "#dedede",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },

  input: {
    flex: 1,
    marginHorizontal: 5,
  },

  icon: {
    marginHorizontal: 5,
  },

  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#3777f0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 35,
  },
});

export default styles;
