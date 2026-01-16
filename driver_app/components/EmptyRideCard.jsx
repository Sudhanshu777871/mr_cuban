import React from "react";
import {

  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import img2 from "../assets/img/login.jpg";
import { router } from "expo-router";

const EmptyRideCard = ({}) => {
  return (
    <TouchableOpacity onPress={() => router.push("/add-ride")}>
      <View style={styles.model_card}>
        <Image
          source={img2}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 5,
          }}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.text}>
            You currently have no registered rides. To fulfill your customer's
            orders, please register your rides.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EmptyRideCard;

const styles = StyleSheet.create({
  model_card: {
    width: 180,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
    position: "relative",
  },
  content: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding:10

  },

  text: {
    color: "#fff",
    textAlign:"center",
    fontSize:13,
    lineHeight:18
  },
});
