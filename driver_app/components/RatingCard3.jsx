import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../assets/color";

const RatingCard3 = ({ flag }) => {
  return (
    <TouchableOpacity>
      <View style={flag ? styles.model_card2:styles.model_card}>
            <ActivityIndicator color={colors.primary} size={30} />
      </View>
    </TouchableOpacity>
  );
};

export default RatingCard3;

const styles = StyleSheet.create({
  model_card: {
    width: 160,
    height: 130,
    marginRight: 10,
    borderRadius: 5,
    position: "relative",
    backgroundColor:"whitesmoke",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  model_card2: {
    width: "100%",
    height: 130,
    marginRight: 10,
    borderRadius: 5,
    position: "relative",
    backgroundColor:"whitesmoke",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom:20
  },
 
});
