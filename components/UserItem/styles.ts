import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 3,
  },

  text: {
    color: "grey",
  },

  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  badgeContainer: {
    backgroundColor: "#3777f0",
    width: 20,
    height: 20,
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    left: 45,
    top: 10,
    borderWidth: 1,
    borderColor: "white",
  },

  badgeText: {
    color: "white",
    fontSize: 12,
  },

  rightContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default styles;
