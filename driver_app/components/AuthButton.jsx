import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,

} from "react-native";
import React from "react";
import { colors } from "../assets/color";

const AuthButton = ({ title, handlePress, loading }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={loading || false}
    >
      {loading ? (
        <ActivityIndicator size={"small"} color={"#fff"} />
      ) : (
        <Text style={styles.p1}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.dark,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: 'rgba(149, 157, 165, 0.2)', 
    shadowOffset: { width: 0, height: 8 },  
    shadowOpacity: 1,                       
    shadowRadius: 24,                       
    elevation: 5,                           
  },
  p1: {
    color: "#fff",
    fontFamily: "bold",
    fontWeight: "bold",
    fontSize:15,
    marginTop: 0,
    padding: 0,
  },
});
