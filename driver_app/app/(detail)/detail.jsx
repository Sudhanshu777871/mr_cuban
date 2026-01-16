import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";
import img from "../../assets/img/ax.jpeg";
import { router, useLocalSearchParams } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useDispatch, useSelector } from "react-redux";
import { AcceptDriverOrderAPI, AcceptOrderAPI } from "../../api/order";
import Feather from "@expo/vector-icons/Feather";
import RideCard from "../../components/RideCard";
import { GetActiveRides, GetRides, GetPreviousRideAPI } from "../../api/other";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyRideCard from "../../components/EmptyRideCard";


const detail = () => {
  const { order } = useSelector((state) => state.driver);
  const { user } = useSelector((state) => state.user);
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [rides, setRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [customerPreviousRide, setCustomerPreviousRide] = useState(null);


  const [loading, setLoading] = useState(false);



  const handleChangeText = (text) => {
    const sanitizedText = text.replace(/[^0-9]/g, "");
    setPrice(sanitizedText); // Set the valid text
  };

  const CreateOrder = async () => {
    try {
      if (price === "" || price === 0)
        return ToastAndroid.show("Price is Required", ToastAndroid.SHORT);
      if (model === "")
        return ToastAndroid.show("Vichele is Required", ToastAndroid.SHORT);

      setLoading(true);
      const result = await AcceptDriverOrderAPI(
        price,
        order?._id,
        user?._id,
        user?.name,
        model,
        user?.ratings,
        user?.orders,
        user?.phone
      );

      if (result?.data?.data) {
        ToastAndroid.show(
          "Your Request sent successfully.",
          ToastAndroid.SHORT
        );
        router.push("/Request");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRides = async () => {
    try {
      setRidesLoading(true);
      const result = await GetActiveRides(user?._id);
      if (result?.data?.data) {
        setRides(result?.data?.data);
      } else {
        setRides([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRidesLoading(false);
    }
  };

  const fetchPreviousCustomerRides = async (customerId, rideId) => {
    console.log("Called fetchPreviousCustomerRides Function")
    const token = await AsyncStorage.getItem("token");
    console.log("CustomerId : ", customerId, " Ride Id : ", rideId, " Token : ", token)
    try {
      setRidesLoading(true);
      const result = await GetPreviousRideAPI(customerId, rideId, token);
      if (result?.success) {
        setCustomerPreviousRide(result?.data);
      } else {
        console.log(result)
        setCustomerPreviousRide(null);
        return ToastAndroid.show("Issue while fetching customer recent ride", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRidesLoading(false);
    }
  };


  useEffect(() => {
    // Auto-fill the price input if there's a negotiation price
    if (order?.negotiatePrice) {
      setPrice(order.negotiatePrice);
    }
  }, [order?.negotiatePrice]);
  
  // Update your existing useEffect that fetches rides
  useEffect(() => {
    if (user?._id) {
      fetchRides();
      fetchPreviousCustomerRides(order?.customer_id, order?._id);
      
      // Check if there's a negotiation price and auto-fill
      const driverNegotiations = order?.negotiation?.filter((n) => n?.id === user?._id) || [];
      if (driverNegotiations.length > 0) {
        const latestNegotiation = driverNegotiations[driverNegotiations.length - 1];
        setPrice(latestNegotiation?.price || "");
      }
    }
  }, [user?._id]);

  const encodedPickupAddress = encodeURIComponent(order?.pickup_address);
  const encodedDropAddress = encodeURIComponent(order?.drop_address);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedPickupAddress}&destination=${encodedDropAddress}`;
  const pickupMapUrl = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${encodedPickupAddress}`;
  const dropMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${encodedDropAddress}`;


  const openGoogleMaps = () => {
    Linking.openURL(googleMapsUrl).catch((err) =>
      console.error("Failed to open Google Maps URL:", err)
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <Text style={styles.h1}>Client Ride Details</Text>
        <Text style={styles.p}>
          View all the essential details of your client’s ride order, including
          pickup and drop-off locations, fare estimates, and special requests.
        </Text>

        <Text style={{ color: "#000", marginTop: 10 }}>
          One Way Trip Details
        </Text>
        <View style={styles.wrap}>
          <View style={styles.left}>
            <View style={styles.span}>
              <Feather name="map-pin" size={14} color={colors.primary} />
            </View>
            <Text style={styles.address}>{order?.pickup_address}</Text>
          </View>
          <View style={styles.right}>
            <View style={styles.span}>
              <Feather name="map-pin" size={14} color={colors.primary} />
            </View>
            <Text style={styles.address}>{order?.drop_address}</Text>
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
              textTransform: "uppercase",
            }}
          >
            <Fontisto
              name="date"
              size={14}
              color="#454545"
              style={{ marginLeft: 10 }}
            />{" "}
            {order?.pickup_date}
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
            {order?.trip_type}
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
            {order?.seater || 4} Seater
          </Text>
        </View>

        {order?.trip_type === "Round Trip" && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: "#000", marginTop: 10 }}>
              Round Trip Details
            </Text>
            <View style={styles.wrap}>
              <View style={styles.left}>
                <View style={styles.span2}>
                  <Feather name="map-pin" size={14} color={"#7a0099"} />
                </View>
                <Text style={styles.address}>{order?.drop_address}</Text>
              </View>
              <View style={styles.right}>
                <View style={styles.span2}>
                  <Feather name="map-pin" size={14} color={" #7a0099"} />
                </View>
                <Text style={styles.address}>{order?.pickup_address}</Text>
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
                  textTransform: "uppercase",
                }}
              >
                <Fontisto
                  name="date"
                  size={14}
                  color="#454545"
                  style={{ marginLeft: 10 }}
                />{" "}
                {order?.return_date}
              </Text>
              <Text
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <FontAwesome6
                  name="brave-reverse"
                  size={14}
                  color={"#454545"}
                />{" "}
                {order?.trip_type}
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
                {order?.seater || 4} Seater
              </Text>
            </View>
          </View>
        )}
        <Text style={{ color: "#454545", marginTop: 20 }}>
          One Way Distance (Aprox): {order?.distance || 0} KM
        </Text>
        <Text style={{ color: "#454545", marginTop: 20, marginBottom: 5 }}>Google Map Link:</Text>
        <TouchableOpacity onPress={openGoogleMaps}>
          <Text numberOfLines={2} style={{ color: colors.primary, fontSize: 12, lineHeight: 16 }}>{googleMapsUrl}</Text>
        </TouchableOpacity>

        <Text style={{ color: "#454545", marginTop: 20 }}>Select Ride</Text>
        <View style={styles.model}>
          {ridesLoading ? (
            <FlatList
              horizontal
              data={[1, 2, 3]}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <RideCard
                  setModel={setModel}
                  model={model}
                  index={index}
                  flag={false}
                  seat={order?.seater}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          ) : ridesLoading === false && rides?.length === 0 ? (
            <EmptyRideCard />
          ) : (
            <FlatList
              horizontal
              data={rides}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <RideCard
                  setModel={setModel}
                  model={model}
                  index={index}
                  flag={true}
                  item={item}
                  seat={order?.seater}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        <View>
          <Text style={{ color: "#000", marginTop: 10, fontWeight: "bold" }}>Customer Previous Ride Detail On Same Journey</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          {ridesLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : customerPreviousRide ? (
            <View style={{ padding: 15, backgroundColor: "#f3f3f3", borderRadius: 8 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#000" }}>
                Previous Ride Summary
              </Text>
              <Text style={{ marginTop: 5 }}>Pickup Location : {customerPreviousRide?.distance1}</Text>
              <Text style={{ marginTop: 5 }}>Drop Location : {customerPreviousRide?.distance2} KM</Text>
              <Text style={{ marginTop: 5 }}>Date : {customerPreviousRide?.date1}</Text>
              <Text style={{ marginTop: 5 }}>Distance : {customerPreviousRide?.km} KM</Text>
              <Text style={{ marginTop: 5 }}>Seater : {customerPreviousRide?.seater}</Text>
              <Text style={{ marginTop: 5 }}>Type : {customerPreviousRide?.type}</Text>
              <Text style={{ marginTop: 5 }}>Price : ₹{customerPreviousRide?.price}</Text>
            </View>
          ) : (
            <Text style={{ color: "#555", fontStyle: "italic" }}>
              Customer has not booked a ride before for the same pickup and drop location.
            </Text>
          )}
        </View>

        <View style={styles.group}>
          <TextInput
            placeholder="Enter Amount"
            style={styles.in}
            keyboardType="numeric"
            value={price}
            onChangeText={handleChangeText}
          />
          <TouchableOpacity
            onPress={CreateOrder}
            disabled={loading}
            style={{ width: "50%" }}
          >
            <View style={styles.btn}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                {loading ? <ActivityIndicator /> : "Send Request"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {order?.trip_type === "Round Trip" && price && (
          <Text
            style={{
              color: "orange",
              marginTop: 10,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Ride per kilometer: ₹{((parseFloat(price) || 0) / ((parseFloat(order?.distance) || 0) * 2)).toFixed(2)} /km
          </Text>
        )}
        <Text
          style={{
            color: "#454545",
            marginTop: 20,
            textAlign: "justify",
            lineHeight: 18,
          }}
        >
          Enter your price based on the order details and confirm if the client
          is interested in your offer. Once confirmed, the order will be
          registered.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default detail;

const styles = StyleSheet.create({
  h1: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  p: {
    color: "#454545",
    textAlign: "justify",
    lineHeight: 20,
    marginTop: 5,
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
  span2: {
    backgroundColor: "#fae6ff",
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
  address: {
    width: "90%",
    color: "#454545",
    textAlign: "justify",
  },
  time: {
    width: "100%",
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  group: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "whitesmoke",
    marginTop: 40,
  },
  in: {
    width: "50%",
    height: 50,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingLeft: 10,
  },
  btn: {
    backgroundColor: "#000",
    width: "100%",
    height: 50,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  model: {
    marginTop: 10,
  },
});