import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  View,
} from "react-native";
import img2 from "../assets/img/login.jpg";
import { colors } from "../assets/color";

const RideCard = ({ setModel, model, index, flag, item, seat }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        seat !== item?.seat
          ? ToastAndroid.show(`Only ${seat} seater car allowed`, ToastAndroid.SHORT)
          : setModel({
              model: item?.modelName,
              modelNumber: item?.modelNumber,
              seat: item?.seat,
              modelImage: item?.img,
            })
      }
      key={index}
    >
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
        <View
          style={
            model?.modelNumber === item?.modelNumber
              ? styles.content2
              : styles.content
          }
        >
          {flag && <Text style={styles.text}>{item?.modelName}</Text>}
          {flag && <Text style={styles.text}>{item?.modelNumber}</Text>}
          {flag && <Text style={styles.text}>{item?.seat} Seater</Text>}
          {flag === false && (
            <ActivityIndicator color={colors.primary} size={20} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RideCard;

const styles = StyleSheet.create({
  model_card: {
    width: 150,
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
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content2: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "#27c26d85",
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
});
