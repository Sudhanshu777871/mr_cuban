import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../assets/color";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { timeAgo } from "../helper";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";



const OrderCard = ({ item }) => {
  const [date, setDate] = useState("");

  useEffect(() => {
    if (item) {
      setDate(timeAgo(item?.createdAt));
    }
  }, [item]);

  return (
    <View style={styles.card} key={item?._id}>
      <View style={styles.top}>
        <Text style={styles.p}>Route</Text>
        <Text style={styles.p}>{date}</Text>
      </View>
      <View style={styles.wrap}>
        <View style={styles.left}>
          <View style={styles.span}>
            <Feather name="map-pin" size={14} color={colors.primary} />
          </View>
          <Text style={styles.address}>{item?.distance1}</Text>
        </View>
        <View style={styles.right}>
          <View style={styles.span}>
            <Feather name="map-pin" size={14} color={colors.primary} />
          </View>
          <Text style={styles.address}>{item?.distance2}</Text>
        </View>
        <View style={styles.line}></View>
      </View>
      <View style={styles.time}>
        <Text
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Fontisto
            name="date"
            size={14}
            color="#454545"
            style={{ marginLeft: 10 }}
          />{" "}
          {item?.date1?.split(",")[0]}
        </Text>
        <Text
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <FontAwesome6 name="brave-reverse" size={14} color={"#454545"} />{" "}
          {item?.type}
        </Text>
        <Text
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="airline-seat-recline-extra"
            size={14}
            color="#454545"
            style={{ marginRight: 5 }}
          />
          {item?.seater || 4} Seater
        </Text>
      </View>

      <View style={item?.status === "start" ? styles.view2 : styles.view}>
        {item?.status === "start" ? (
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Ride Started
          </Text>
        ) : item?.status === "complete" || item?.status === "cancel" ? (
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 15,
              textTransform: "capitalize",
            }}
          >
            Ride {item?.status === "complete" ? "Completed" : "Cancelled"}
          </Text>
        ) : (
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            View Detaile ₹{item?.price}
          </Text>
        )}
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    display: "flex",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 5,
    marginBottom: 15,
  },
  card2: {
    width: "100%",
    display: "flex",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#f6f6f6",
  },

  top: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  p: {
    color: "#454545",
    fontSize: 12,
  },
  wrap: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
    gap: 20,
  },
  left: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    position: "relative",
  },
  right: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    position: "relative",
  },
  span: {
    backgroundColor: "#eafbf1",
    padding: 5,
    borderRadius: 50,
  },
  line: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#ccc",
    top: "25%",
    bottom: "25%",
    left: 10,
    height: "25%",
    borderStyle: "dashed",
  },
  time: {
    width: "100%",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingLeft: 30,
  },
  address: {
    width: "90%",
    color: "#454545",
    textAlign: "justify",
  },
  view: {
    width: "100%",
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 5,
    marginTop: 15,
  },
  view2: {
    width: "100%",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    marginTop: 15,
  },
});
