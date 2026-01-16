import {
  Alert,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import img from "../../assets/img/login.jpg";
import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../../components/AuthButton";
import { router } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { CancelOrderAfterAPI } from "../../api/order";
import { StatusBar } from "expo-status-bar";
import RatingModal from "../../components/RatingModal";
import AudioCallModal from "../../components/AudioCallModal";
import { SendCallNotificationAPI } from "../../api/agora";

const orderdetail = () => {
  const { user } = useSelector((state) => state.user);
  const { order } = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [canCall, setCanCall] = useState(false);

  const dispatch = useDispatch();

  // Debug: Log order structure
  console.log("Order Object:", order);
  console.log("Order Driver Array:", order?.driver);
  console.log("First Driver:", order?.driver?.[0]);

  // Check if calling is allowed (within 30 minutes of pickup time)
  useEffect(() => {
    checkCallAvailability();
  }, [order]);

  const checkCallAvailability = () => {
    if (!order?.date1 || order?.status === "complete" || order?.status === "cancel") {
      setCanCall(false);
      return;
    }

    try {
      console.log("Order date1:", order.date1);

      // Parse the date string - handle multiple formats
      let pickupTime;

      if (order.date1.includes(" | ")) {
        // Format: "12/31/2025 | 10:30 AM"
        const dateStr = order.date1.split(" | ")[0];
        const timeStr = order.date1.split(" | ")[1];
        const [month, day, year] = dateStr.split("/");
        pickupTime = new Date(`${year}-${month}-${day} ${timeStr}`);
      } else if (order.date1.includes(", ")) {
        // Format: "31/12/2025, 5:30:37 pm" (DD/MM/YYYY, HH:MM:SS am/pm)
        const [datePart, timePartWithPeriod] = order.date1.split(", ");
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
        pickupTime = new Date(order.date1);
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
      // Send call notification to driver
      // Use driver order ID for consistent channel naming between both parties
      const channelName = `order_${order?.driverOrderId}`;
      const driverId = order?.driver[0]?.id || order?.driver[0]?.driverId || order?.driver[0]?._id;

      console.log("Sending call notification:");
      console.log("- Driver ID:", driverId);
      console.log("- Caller Name:", user?.name);
      console.log("- Channel:", channelName);

      await SendCallNotificationAPI(
        driverId,
        user?.name || "Customer",
        channelName,
        user?._id // Pass customer ID as caller ID
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

  const CancelOrder = async () => {
    Alert.alert(
      "Cancel Ride", // Title of the alert
      "Are you sure you want to cancel this ride?", // Message
      [
        {
          text: "No",
          onPress: () => console.log("Ride cancellation aborted"), // If "No" is pressed
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setLoading(true);
              const result = await CancelOrderAfterAPI(
                order?._id,
                order?.driverOrderId
              );
              if (result?.data?.data) {
                dispatch({ type: "deleteOrder", payload: false });
                ToastAndroid.show(
                  "Ride canceled successfully 🚗",
                  ToastAndroid.SHORT
                );
                router.push("/history");
              }
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={img}
      style={{ flex: 1, justifyContent: "center" }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }}>
        <View style={styles.door}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          >
            <View style={styles.wrap}>
              <Text style={styles.text}>Ride Details</Text>
              <View style={styles.otp}>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[0]}
                </Text>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[1]}
                </Text>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[2]}
                </Text>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[3]}
                </Text>
              </View>
            </View>

            <View style={styles.profile}>
              <View style={styles.icon}>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 20,
                    textTransform: "capitalize",
                  }}
                >
                  {String(order?.driver[0]?.name)[0] || "G"}
                </Text>
              </View>
              <View style={styles.content}>
                <Text style={{ color: "#fff", fontWeight: 600, fontSize: 20 }}>
                  {order?.driver[0]?.name}
                </Text>
                <View style={styles.rate}>
                  <Text style={styles.star}>
                    <Fontisto name="star" size={12} color={colors.primary} />{" "}
                    {order?.driver[0]?.rating || 0}+
                  </Text>
                  <Text style={styles.order}>
                    {order?.driver[0]?.orders || 0} Orders
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Model Name</Text>
              <Text style={styles.text1}>
                {order?.driver[0]?.model?.model || ""}
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Vichele Number</Text>
              <Text style={styles.text1}>
                {order?.driver[0]?.model?.modelNumber || ""}
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Round Trip</Text>
              <Text style={styles.text1}>
                {order?.type === "Round Trip" ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Total Price</Text>
              <Text style={styles.text1}>₹{order?.price}</Text>
            </View>
            {/* <View style={styles.form}>
              <Text style={styles.label}>Contact Number</Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`tel:${order?.driver[0]?.phone}`)
                }
              >
                <Text style={{ fontSize: 16, color: colors.primary }}>
                  {order?.driver[0]?.phone || "-"}
                </Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles.form}>
              <Text style={styles.label}>Pickup Location</Text>
              <Text style={styles.text1}>{order?.distance1}</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Drop Location</Text>
              <Text style={styles.text1}>{order?.distance2}</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Pickup Time</Text>
              <Text style={styles.text1}>{order?.date1}</Text>
            </View>
            {order?.type === "Round Trip" && (
              <>
                <View style={styles.form}>
                  <Text style={styles.label}>Return Pickup Location</Text>
                  <Text style={styles.text1}>{order?.distance3}</Text>
                </View>

                <View style={styles.form}>
                  <Text style={styles.label}>Return Drop Location</Text>
                  <Text style={styles.text1}>{order?.distance4}</Text>
                </View>

                <View style={styles.form}>
                  <Text style={styles.label}>Return Time</Text>
                  <Text style={styles.text1}>{order?.date2}</Text>
                </View>
              </>
            )}
            <View style={styles.form}>
              <Text style={styles.label}>One Way Distance (Aprox)</Text>
              <Text style={styles.text1}>{order?.km} KM</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Car Images</Text>
              <View style={styles.images}>
                {order?.driver[0]?.model?.modelImage?.map((s) => (
                  <Image
                    resizeMode="cover"
                    source={{ uri: s?.url }}
                    key={s?.public_id}
                    style={styles.img}
                  />
                ))}
              </View>
            </View>

            <View style={styles.list}>
              <Text style={styles.list_head}>Additional Charges:</Text>
              {/* <View style={styles.item}>
                <Text style={styles.title}>
                  Toll Costs, Parking, Permits, and State Taxes:
                </Text>
                <Text style={styles.description}>
                  Excluded from the ride fare.
                </Text>
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
                  May apply if the trip does not end within the designated
                  region (Rest of India).
                </Text>
              </View>
            </View>

            {order?.status === "complete" ? (
              <AuthButton
                title={"Give Feedback"}
                handlePress={() => setModalVisible(true)}
              />
            ) : order?.status === "cancel" ? (
              <AuthButton
                title={"Canceled"}
                loading={loading}
                handlePress={() => {}}
              />
            ) : (
              <View style={styles.buttonRow}>
                {/* Call Button */}
                <TouchableOpacity
                  style={[
                    styles.callButton,
                    !canCall && styles.buttonDisabled,
                  ]}
                  onPress={handleCall}
                  disabled={!canCall}
                >
                  <Ionicons name="call" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Call Driver</Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={CancelOrder}
                >
                  <Ionicons name="close-circle" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Cancel Ride</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text
              style={{
                fontSize: 14,
                marginTop: 10,
                color: "#ccc",
                textAlign: "justify",
                lineHeight: 20,
              }}
            >
              Your ride is confirmed! Please share this OTP with the driver when
              they arrive to begin your ride: {user?.accountOtp}. For your
              safety, do not share the OTP until the driver is with you.
            </Text>
          </ScrollView>

          {modalVisible && (
            <RatingModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              data={{ driver: [{ _id: order?.driver?.[0]?.driverId || order?.driver?.[0]?._id || order?.driver?.[0]?.id }] }}
              id={user?._id}
            />
          )}

          {/* Audio Call Modal */}
          <AudioCallModal
            visible={callModalVisible}
            onClose={() => setCallModalVisible(false)}
            driverName={order?.driver[0]?.name || "Driver"}
            channelName={`order_${order?.driverOrderId}`}
          />
        </View>

        <StatusBar backgroundColor="#000" style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default orderdetail;

const styles = StyleSheet.create({
  door: {
    width: "100%",
    display: "flex",
    padding: 20,
    bottom: 0,
    flex: 1,
  },
  wrap: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 15,
  },
  otp: {
    display: "flex",
    width: 100,
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  otptext: {
    backgroundColor: colors.primary,
    color: "#fff",
    borderRadius: 5,
    paddingVertical: 10, // Equivalent to 1rem
    paddingHorizontal: 16,
  },
  profile: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 50,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: 5,
  },
  rate: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  star: {
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    color: "#fff",
  },
  order: {
    color: "#fff",
    fontSize: 16,
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginBottom: 10,
  },
  label: {
    color: "#ccc",
    fontSize: 14,
  },
  text1: {
    color: "#fff",
    fontSize: 16,
  },
  back: {
    color: "#fff",
    marginTop: 20,
    marginLeft: 20,
  },
  images: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop:5
  },
  img: {
    width: 100,
    height: 100,
    objectFit: "cover",
    borderRadius: 5,
  },
  list:{
    marginTop:10,
   
  },
  list_head:{
    color:"#fff",
    fontSize:16,
    marginBottom:10
  },
  item:{
    width:"100%",
    display:"flex",
    flexDirection:"column",
    marginBottom:10
  },
  title:{
    color:colors.primary,
    fontSize:14
  },
  description:{
    color:"#fff",
    fontSize:13,
    marginTop:3
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  callButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f44336",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
