import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../assets/color";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { timeAgo } from "../helper";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

const Card = ({ item }) => {
  console.log(item);
  const { user } = useSelector((state) => state.user);
  const [date, setDate] = useState("");
  const [flag, setFlag] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [showNegotiateLabel, setShowNegotiateLabel] = useState(false);
  const [latestNegotiatePrice, setLatestNegotiatePrice] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (item && user?._id) {
      console.log("The Data comes in item field in Card.jsx file is ::::::: ", item);
      setDate(timeAgo(item?.createdAt));
      
      // Check if driver has already accepted the ride
      const driverData = item?.drivers?.find((f) => f?.id === user?._id);
      
      if (driverData) {
        setFlag(true);
        
        // Get all negotiations for this driver and find the latest one
        const driverNegotiations = item?.negotiation?.filter((n) => n?.id === user?._id) || [];
        
        if (driverNegotiations.length > 0) {
          // Get the latest negotiation (last item in array)
          const latestNegotiation = driverNegotiations[driverNegotiations.length - 1];
          
          // Driver has negotiation request
          setShowNegotiateLabel(true);
          setLatestNegotiatePrice(latestNegotiation?.price);
          setButtonText(`Negotiate Request (₹${latestNegotiation?.price})`);
        } else {
          // Driver has sent ride request but no negotiation yet
          // Get the latest driver entry (in case of multiple submissions)
          const allDriverEntries = item?.drivers?.filter((f) => f?.id === user?._id) || [];
          const latestDriverEntry = allDriverEntries[allDriverEntries.length - 1];
          
          setShowNegotiateLabel(false);
          setButtonText(`Ride Request Sent (₹${latestDriverEntry?.price || driverData?.price})`);
        }
      } else {
        // Driver hasn't accepted the ride yet
        setFlag(false);
        setShowNegotiateLabel(false);
        setButtonText(`Take a trip (${item?.distance || 0} KM)`);
      }
    }
  }, [item, user?._id]);

  const handleCardPress = () => {
    // Pass the latest negotiate price along with the order
    dispatch({ 
      type: "addOrder", 
      payload: { 
        ...item, 
        negotiatePrice: latestNegotiatePrice 
      } 
    });
    router.push({ pathname: "/detail" });
  };

  return (
    <View style={flag ? styles.card2 : styles.card} key={item?._id}>
      {showNegotiateLabel && (
        <View style={styles.negotiateLabel}>
          <Text style={styles.negotiateLabelText}>🔔 Negotiate Request</Text>
        </View>
      )}
      
      <View style={styles.top}>
        <Text style={styles.p}>Route</Text>
        <Text style={styles.p}>{date}</Text>
      </View>
      
      <View style={styles.wrap}>
        <View style={styles.left}>
          <View style={styles.span}>
            <Feather name="map-pin" size={14} color={colors.primary} />
          </View>
          <Text style={styles.address}>{item?.pickup_address}</Text>
        </View>
        <View style={styles.right}>
          <View style={styles.span}>
            <Feather name="map-pin" size={14} color={colors.primary} />
          </View>
          <Text style={styles.address}>{item?.drop_address}</Text>
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
            textTransform: "uppercase"
          }}
        >
          <Fontisto
            name="date"
            size={14}
            color="#454545"
            style={{ marginLeft: 10 }}
          />{" "}
          {item?.pickup_date?.split(",")[0]}
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
          {item?.trip_type}
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
      
      <TouchableOpacity onPress={handleCardPress}>
        <View style={showNegotiateLabel ? styles.viewNegotiate : styles.view}>
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            {buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

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
    backgroundColor: "#f6f6f6"
  },
  negotiateLabel: {
    backgroundColor: "#fff3cd",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  negotiateLabelText: {
    color: "#856404",
    fontSize: 12,
    fontWeight: "bold",
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
  viewNegotiate: {
    width: "100%",
    padding: 10,
    backgroundColor: "#ff6b35",
    borderRadius: 5,
    marginTop: 15,
  },
});