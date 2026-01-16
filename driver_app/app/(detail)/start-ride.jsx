import {
    ActivityIndicator,
  Linking,
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
import { useSelector } from "react-redux";
import OTPTextInput from "react-native-otp-textinput";
import { StartRideAPI } from "../../api/order";
import { router } from "expo-router";

const StartRide = () => {
  const { orderDetail } = useSelector((state) => state.driver);
  const [otp, setOtp] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCellTextChange = (cellText, cellIndex) => {
    const newOtp = [...otp]; // Copy the current OTP array
    newOtp[cellIndex] = cellText; // Update the specific cell
    setOtp(newOtp); // Update the state with the new OTP array
  };

  const getFullOtp = () => {
    return otp.join(""); // Join the array into a single string
  };

  const confirmOrder = async () => {
    try {
      if (otp?.length!==4)
        return ToastAndroid.show("OTP is Required", ToastAndroid.SHORT);

      setLoading(true);
      let newOTP = getFullOtp()
      const result = await StartRideAPI(orderDetail?.d?._id,newOTP);
      if (result?.data?.data) {
        ToastAndroid.show("Ride Start Successfully", ToastAndroid.SHORT);
        router.push("/history");
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
          Instructions for Customers
        </Text>

        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.header}>Enter Your OTP:</Text>
            <Text style={styles.instructions}>
              After confirming your ride, you will receive a One-Time Password
              (OTP) on your registered mobile number. Please enter the OTP in
              the designated field below to proceed with your ride.
            </Text>

            <Text style={styles.header}>Start Your Ride:</Text>
            <Text style={styles.instructions}>
              Once the OTP is verified, your ride will begin. You will be
              notified when your driver is on the way.
            </Text>

            <Text style={styles.header}>Complete Your Ride:</Text>
            <Text style={styles.instructions}>
              After reaching your destination, please press the Finish Ride
              button. This action will mark the end of your ride.
            </Text>

            <Text style={styles.header}>Order Completion:</Text>
            <Text style={styles.instructions}>
              Upon pressing the Finish Ride button, your order will be
              successfully completed, and you will receive a confirmation
              message.
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.start}
          disabled={loading}
          onPress={confirmOrder}
        >
          <View>
            {loading ? <ActivityIndicator/>:
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Confirm OTP
            </Text>}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StartRide;

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
