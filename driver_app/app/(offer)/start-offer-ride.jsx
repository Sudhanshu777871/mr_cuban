import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";
import OTPTextInput from "react-native-otp-textinput";
import { StartOfferRideAPI } from "../../api/offer";
import { router, useLocalSearchParams } from "expo-router";

const StartOfferRide = () => {
  const params = useLocalSearchParams();
  const driverOrderId = params?.driverOrderId;
  const [otp, setOtp] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debug: Log the driverOrderId
  console.log("Driver Order ID:", driverOrderId);

  const handleCellTextChange = (cellText, cellIndex) => {
    const newOtp = [...otp];
    newOtp[cellIndex] = cellText;
    setOtp(newOtp);
  };

  const getFullOtp = () => {
    return otp.join("");
  };

  const confirmOrder = async () => {
    try {
      if (otp?.length !== 4)
        return ToastAndroid.show("OTP is Required", ToastAndroid.SHORT);

      setLoading(true);
      let newOTP = getFullOtp();
      const result = await StartOfferRideAPI(driverOrderId, newOTP);
      if (result?.data?.success) {
        ToastAndroid.show("Ride Started Successfully", ToastAndroid.LONG);
        router.back();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <Text style={styles.h1}>
          Ride Confirmation and{" "}
          <Text style={{ color: "#000" }}>OTP Verification</Text>{" "}
        </Text>

        <View style={styles.formGroup}>
          <OTPTextInput
            inputCount={4}
            offTintColor={"No"}
            handleCellTextChange={handleCellTextChange}
            tintColor={"No"}
            textInputStyle={{
              width: 50,
              height: 50,
              border: "none",
              backgroundColor: "#f5f5f5",
              borderRadius: 5,
              color: "#454545",
              fontSize: 18,
              borderBottomColor: "#f5f5f5",
            }}
          />
        </View>

        <Text
          style={{
            color: "#000",
            marginTop: 20,
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          Instructions for Starting Offer Ride
        </Text>

        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.header}>Enter Customer's OTP:</Text>
            <Text style={styles.instructions}>
              Ask the customer for their One-Time Password (OTP). The customer
              has received this OTP when they accepted your offer. Please enter
              the 4-digit OTP in the field above to verify and start the ride.
            </Text>

            <Text style={styles.header}>Start Your Ride:</Text>
            <Text style={styles.instructions}>
              Once the OTP is verified successfully, the ride will begin. Make
              sure you're ready to pick up the customer from the specified
              pickup location.
            </Text>

            <Text style={styles.header}>Navigate to Pickup:</Text>
            <Text style={styles.instructions}>
              Use the Google Maps navigation button in the offer details to
              navigate to the customer's pickup location.
            </Text>

            <Text style={styles.header}>Complete Your Ride:</Text>
            <Text style={styles.instructions}>
              After reaching the destination, press the Finish Ride button in
              the offer details screen. This will mark the ride as completed
              and process the payment.
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.start}
          disabled={loading}
          onPress={confirmOrder}
        >
          <View>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Confirm OTP & Start Ride
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StartOfferRide;

const styles = StyleSheet.create({
  h1: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 25,
    marginTop: 10,
  },
  instructions: {
    color: "#454545",
    textAlign: "justify",
    lineHeight: 20,
    marginBottom: 5,
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
  formGroup: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  header: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 3,
  },
});
