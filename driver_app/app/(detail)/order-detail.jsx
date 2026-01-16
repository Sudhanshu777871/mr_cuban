import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import CustomCountdown from "../../components/CountDown";
import { router } from "expo-router";
import { FinishRideAPI } from "../../api/order";
import ConfettiCannon from "react-native-confetti-cannon";
import AudioCallModal from "../../components/AudioCallModal";
import { SendCallNotificationAPI } from "../../api/agora";

const OrderDetails = () => {
  const { orderDetail } = useSelector((state) => state.driver);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [canCall, setCanCall] = useState(false);

  const targetDateStr = `${orderDetail?.d?.date1?.split(" ")[0]} ${
    orderDetail?.d?.date1?.split(" | ")[1]
  }`;

  // Check if calling is allowed (within 30 minutes of pickup time)
  useEffect(() => {
    checkCallAvailability();
  }, [orderDetail]);

  const checkCallAvailability = () => {
    if (!orderDetail?.d?.date1 || orderDetail?.d?.status === "complete" || orderDetail?.d?.status === "cancel") {
      setCanCall(false);
      return;
    }

    try {
      console.log("Order date1:", orderDetail.d.date1);

      // Parse the date string - handle multiple formats
      let pickupTime;

      if (orderDetail.d.date1.includes(" | ")) {
        // Format: "12/31/2025 | 10:30 AM"
        const dateStr = orderDetail.d.date1.split(" | ")[0];
        const timeStr = orderDetail.d.date1.split(" | ")[1];
        const [month, day, year] = dateStr.split("/");
        pickupTime = new Date(`${year}-${month}-${day} ${timeStr}`);
      } else if (orderDetail.d.date1.includes(", ")) {
        // Format: "31/12/2025, 5:30:37 pm" (DD/MM/YYYY, HH:MM:SS am/pm)
        const [datePart, timePartWithPeriod] = orderDetail.d.date1.split(", ");
        const [day, month, year] = datePart.split("/");

        // Parse time with am/pm
        const isPM = timePartWithPeriod.toLowerCase().includes("pm");
        const isAM = timePartWithPeriod.toLowerCase().includes("am");
        const timePart = timePartWithPeriod.replace(/\s?(am|pm)/gi, "").trim();
        const [hours, minutes, seconds] = timePart.split(":");

        let hour24 = parseInt(hours);
        if (isPM && hour24 !== 12) {
          hour24 += 12;
        } else if (isAM && hour24 === 12) {
          hour24 = 0;
        }

        // Create date object with proper format
        pickupTime = new Date(
          parseInt(year),
          parseInt(month) - 1, // Months are 0-indexed
          parseInt(day),
          hour24,
          parseInt(minutes || 0),
          parseInt(seconds || 0)
        );
      } else {
        // Fallback: Try to parse directly
        pickupTime = new Date(orderDetail.d.date1);
      }

      const currentTime = new Date();
      const timeDiff = pickupTime - currentTime;

      console.log("Pickup Time:", pickupTime);
      console.log("Current Time:", currentTime);
      console.log("Time Diff (ms):", timeDiff);
      console.log("Time Diff (minutes):", Math.floor(timeDiff / (1000 * 60)));

      // For regular rides: Allow calling anytime before pickup time + 1 hour
      // Disable only after 1 hour past the pickup time
      if (timeDiff >= -60 * 60 * 1000) { // -1 hour in milliseconds
        setCanCall(true);
        console.log("Call button ENABLED");
      } else {
        setCanCall(false);
        console.log("Call button DISABLED");
      }
    } catch (error) {
      console.log("Error checking call availability:", error);
      setCanCall(false);
    }
  };

  const handleCall = async () => {
    if (!canCall) {
      ToastAndroid.show("Calling is not available at this time", ToastAndroid.LONG);
      return;
    }

    try {
      // Send call notification to customer
      const channelName = `order_${orderDetail?.d?._id}`;
      const customerId = orderDetail?.p?._id;

      console.log("Sending call notification:");
      console.log("- Customer ID:", customerId);
      console.log("- Caller Name:", user?.name);
      console.log("- Channel:", channelName);

      await SendCallNotificationAPI(
        customerId,
        user?.name || "Driver",
        channelName,
        user?._id // Pass driver ID as caller ID
      );

      // Open call modal
      setCallModalVisible(true);
    } catch (error) {
      console.log("Error sending call notification:", error);
      console.log("Error details:", error.response?.data);
      // Still open call modal even if notification fails
      setCallModalVisible(true);
    }
  };

  const handleCompleteRide = async () => {
    try {
      setLoading(true);
      const result = await FinishRideAPI(orderDetail?.d?._id);
      if (result?.data?.data) {
        ToastAndroid.show("Ride Complete Successfully", ToastAndroid.SHORT);
        setShowConfetti(true);
        setTimeout(() => {
          router.push("/history");
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const FinishRide = async () => {
    try {
      Alert.alert(
        "Confirm Ride Completion",
        "Are you sure you want to complete this ride? The payment has been successfully received from the customer. This action is irreversible.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Complete Ride",
            onPress: () => handleCompleteRide(),
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkdsate = (targetDate) => {
    const [dateString, timeString] = targetDate.split(" ");
    const [month, day, year] = dateString.split("/");
    const formattedDate = `${year}-${month}-${day}T${timeString}`; // Convert to YYYY-MM-DDTHH:mm:ss format

    const difference = new Date(formattedDate) - new Date();
    return difference;
  };

  const encodedPickupAddress = encodeURIComponent(orderDetail?.d?.distance1);
  const encodedDropAddress = encodeURIComponent(orderDetail?.d?.distance2);

  const pickupMapUrl = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${encodedPickupAddress}`;
  const dropMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${encodedDropAddress}`;

  const openGoogleMaps = () => {
    Linking.openURL(pickupMapUrl).catch((err) =>
      console.error("Failed to open Google Maps URL:", err)
    );
  };

  const openGoogleMaps2 = () => {
    Linking.openURL(dropMapsUrl).catch((err) =>
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
            <Text style={styles.address}>{orderDetail?.d?.distance1}</Text>
          </View>
          <View style={styles.right}>
            <View style={styles.span}>
              <Feather name="map-pin" size={14} color={colors.primary} />
            </View>
            <Text style={styles.address}>{orderDetail?.d?.distance2}</Text>
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
            {orderDetail?.d?.date1}
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
            {orderDetail?.d?.type}
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
            {orderDetail?.d?.seater || 4} Seater
          </Text>
        </View>

        {orderDetail?.d?.type === "Round Trip" && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: "#000", marginTop: 10 }}>
              Round Trip Details
            </Text>
            <View style={styles.wrap}>
              <View style={styles.left}>
                <View style={styles.span2}>
                  <Feather name="map-pin" size={14} color={"#7a0099"} />
                </View>
                <Text style={styles.address}>{orderDetail?.d?.distance2}</Text>
              </View>
              <View style={styles.right}>
                <View style={styles.span2}>
                  <Feather name="map-pin" size={14} color={" #7a0099"} />
                </View>
                <Text style={styles.address}>{orderDetail?.d?.distance1}</Text>
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
                {orderDetail?.d?.date2}
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
                {orderDetail?.d?.type}
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
                {orderDetail?.d?.seater || 4} Seater
              </Text>
            </View>
          </View>
        )}
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: "#000", marginTop: 10 }}>
            Customer Details:-
          </Text>
          <Text style={{ color: "#454545", fontSize: 14, marginTop: 10 }}>
            Customer Name
          </Text>
          <Text style={{ color: "#454545", fontSize: 14, marginTop: 5 }}>
            {orderDetail?.p?.name}
          </Text>

          {/* <Text style={{ color: "#454545", fontSize: 14, marginTop: 10 }}>
            Customer Contact Number
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${orderDetail?.p?.phone}`)}
          >
            <Text style={{ color: colors.primary, fontSize: 14, marginTop: 5 }}>
              {orderDetail?.p?.phone}
            </Text>
          </TouchableOpacity> */}
          <Text style={{ color: "#454545", fontSize: 14, marginTop: 10 }}>
            Ride Price
          </Text>
          <Text style={{ color: "#454545", fontSize: 14, marginTop: 5 }}>
            ₹{orderDetail?.d?.price}
          </Text>
          <Text style={{ color: "#454545", fontSize: 14, marginTop: 10 }}>
            One Way Distance (Aprox)
          </Text>
          <Text style={{ color: "#454545", fontSize: 14, marginTop: 5 }}>
            {orderDetail?.d?.km} KM
          </Text>
        </View>
        <View style={styles.map}>
          <Feather name="map-pin" size={14} color={"red"} />
          <Text style={{ color: "#454545" }}>Google Map Link:</Text>
        </View>
        {orderDetail?.d?.status === "start" ? (
          <TouchableOpacity onPress={openGoogleMaps2}>
            <Text
              numberOfLines={2}
              style={{ color: colors.primary, fontSize: 12, lineHeight: 16 }}
            >
              {dropMapsUrl}
            </Text>
          </TouchableOpacity>
        ) : orderDetail?.d?.status === "complete" ||
          orderDetail?.d?.status === "cancel" ? (
          <TouchableOpacity onPress={openGoogleMaps2}>
            <Text
              numberOfLines={2}
              style={{ color: colors.primary, fontSize: 12, lineHeight: 16 }}
            >
              {dropMapsUrl}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openGoogleMaps}>
            <Text
              numberOfLines={2}
              style={{ color: colors.primary, fontSize: 12, lineHeight: 16 }}
            >
              {pickupMapUrl}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.list}>
          <Text style={styles.list_head}>Additional Charges:</Text>
          {/* <View style={styles.item}>
            <Text style={styles.title}>
              Toll Costs, Parking, Permits, and State Taxes:
            </Text>
            <Text style={styles.description}>Excluded from the ride fare.</Text>
          </View> */}
          <View style={styles.item}>
            <Text style={styles.title}>Extra Hours:</Text>
            <Text style={styles.description}>
              ₹100 per hour for additional hours beyond the booking period.
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>Extra Kilometers:</Text>
            <Text style={styles.description}>
              ₹10 per kilometer for distance exceeding the booked limit.
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>Night Allowance:</Text>
            <Text style={styles.description}>
              ₹500 per night for rides between 11:00 PM and 6:00 AM.
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>Additional Fare:</Text>
            <Text style={styles.description}>
              May apply if the trip does not end within the designated region
              (Rest of India).
            </Text>
          </View>
        </View>

        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: 10, y: 10 }}
            fadeOut={true}
            fallSpeed={5000}
          />
        )}

        {orderDetail?.d?.status === "start" ? (
          <View style={styles.buttonRow}>
            {/* Call Button */}
            <TouchableOpacity
              style={[
                styles.callButtonRow,
                !canCall && styles.buttonDisabled,
              ]}
              onPress={handleCall}
              disabled={!canCall}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.callButtonText}>Call Customer</Text>
            </TouchableOpacity>

            {/* Finish Ride Button */}
            <TouchableOpacity onPress={FinishRide} style={styles.finishButton}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.callButtonText}>Finish Ride</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : orderDetail?.d?.status === "complete" ||
          orderDetail?.d?.status === "cancel" ? (
          <View style={styles.start}>
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Ride{" "}
              {orderDetail?.d?.status === "complete"
                ? "Completed"
                : "Cancelled"}
            </Text>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            {/* Call Button */}
            <TouchableOpacity
              style={[
                styles.callButtonRow,
                !canCall && styles.buttonDisabled,
              ]}
              onPress={handleCall}
              disabled={!canCall}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.callButtonText}>Call Customer</Text>
            </TouchableOpacity>

            {/* Start Ride Button */}
            <TouchableOpacity
              disabled={checkdsate(targetDateStr) > 0}
              style={[
                styles.startButtonRow,
                checkdsate(targetDateStr) > 0 && styles.buttonDisabled,
              ]}
              onPress={() => router.push("/start-ride")}
            >
              <CustomCountdown targetDate={targetDateStr} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Audio Call Modal */}
      <AudioCallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        customerName={orderDetail?.p?.name || "Customer"}
        channelName={`order_${orderDetail?.d?._id}`}
      />
    </SafeAreaView>
  );
};

export default OrderDetails;

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
  start: {
    backgroundColor: "#000",
    width: "100%",
    height: 50,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  start2: {
    backgroundColor: "red",
    width: "100%",
    height: 50,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    marginTop: 10,
    marginBottom: 10,
    flexShrink: 1,
    height: 400,
  },
  list_head: {
    color: "#454545",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
  },
  item: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: 10,
  },
  title: {
    color: colors.primary,
    fontSize: 13,
  },
  description: {
    color: "#454545",
    fontSize: 13,
    marginTop: 3,
    lineHeight: 20,
  },
  map: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 15,
    gap: 5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  callButtonRow: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  startButtonRow: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  finishButton: {
    flex: 1,
    backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
