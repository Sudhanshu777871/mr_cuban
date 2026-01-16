import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../assets/color";
import img from "../../assets/img/login.jpg";
import AuthButton from "../../components/AuthButton";
import lock from "../../assets/img/lock.png";
import unlock from "../../assets/img/unlock.png";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import OTPTextInput from "react-native-otp-textinput";
import { ResetPasswordAPI } from "../../api/auth";

const Reset = () => {
  const { email } = useLocalSearchParams();
  const [show, setShow] = useState(true);
  const [confirm, setConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState([]);


const handleCellTextChange = (cellText, cellIndex) => {
  const newOtp = [...otp]; // Copy the current OTP array
  newOtp[cellIndex] = cellText; // Update the specific cell
  setOtp(newOtp); // Update the state with the new OTP array
};

const getFullOtp = () => {
  return otp.join(''); // Join the array into a single string
};




  const handleLogin = async () => {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email === "") {
        return ToastAndroid.show("Email is required", ToastAndroid.SHORT);
      }

      if (!emailPattern.test(email)) {
        return ToastAndroid.show("Invalid email address", ToastAndroid.SHORT);
      }

      if (password === "") {
        return ToastAndroid.show("Password is required", ToastAndroid.SHORT);
      }

      if (password?.length < 6) {
        return ToastAndroid.show("Password is too short", ToastAndroid.SHORT);
      }

      if (password?.length > 16) {
        return ToastAndroid.show("Password is too long", ToastAndroid.SHORT);
      }
      if (confirm !== password) {
        return ToastAndroid.show(
          "Password and Confirm Password are not same",
          ToastAndroid.SHORT
        );
      }
      if (otp?.length !==6) {
        return ToastAndroid.show(
          "OTP is must be six character",
          ToastAndroid.SHORT
        );
      }
     
      setLoading(true);
      let otpnew = getFullOtp()
      const result = await ResetPasswordAPI(email, password, otpnew);
      if (result?.data?.data) {
        router.replace("/sign-in");
        ToastAndroid.show("Password Reset Successfull", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to Reset Password", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(error?.response?.data?.msg, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        source={img}
        style={{ flex: 1, position: "relative" }}
        resizeMode="cover"
      />
      <View style={styles.layer}>
        <Text style={styles.p2}>
          Reset Password{" "}
          <Text
            style={{
              color: colors.primary,
              fontFamily: "bold",
              fontWeight: "bold",
            }}
          >
            MR{" "}
            <Text
              style={{
                color: colors.green,
                fontFamily: "bold",
                fontWeight: "bold",
              }}
            >
              CUBAN
            </Text>
          </Text>
        </Text>

        <View style={styles.info}>
          <Text
            style={{
              textAlign: "justify",
              color: "#fff",
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            If you don't see a code in your inbox, check your spam folder. if
            it's not there, the email address may not be confirmed, or it may
            not match an existing{" "}
            <Text style={{ color: colors.primary }}>Mr Cuban</Text> account.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input1]}
            placeholder="Enter Email Address"
            value={email}
            placeholderTextColor={"gray"}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.group}>
            <TextInput
              style={styles.input2}
              placeholder="Enter Password"
              secureTextEntry={show}
              placeholderTextColor={"gray"}
              onChangeText={(e) => setPassword(e)}
            />
            {show ? (
              <TouchableOpacity onPress={() => setShow(false)}>
                <Image style={styles.lock} source={lock} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShow(true)}>
                <Image style={styles.lock} source={unlock} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input1]}
            placeholder="Enter Confirm Password "
            onChangeText={(e) => setConfirm(e)}
            placeholderTextColor={"gray"}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>OTP</Text>
          <OTPTextInput
            inputCount={6}
            offTintColor={"No"}
            // ref={(e) => (otp = e)}
            
            handleCellTextChange={handleCellTextChange}
            tintColor={"No"}
            textInputStyle={{
              width: 50,
              height: 50,
              border: "none",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 5,
              color: "#fff",
              fontSize: 18,
            }}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push("/forget")}>
            <Text style={styles.footerText}>Back to Forgot Password page?</Text>
          </TouchableOpacity>
        </View>

        <AuthButton
          loading={loading}
          title="Submit"
          handlePress={() => handleLogin()}
        />
      </View>

      <StatusBar backgroundColor="#000" style="light" />
    </SafeAreaView>
  );
};

export default Reset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layer: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  heading: {
    fontWeight: "bold",
    fontFamily: "bold",
    fontSize: 40,
    color: colors.primary,
  },

  p2: {
    width: "100%",
    color: "#fff",
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 20,
    fontWeight: "bold",
  },
  formGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "regular",
  },
  input1: {
    width: "100%",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    borderColor: "transparent",
    outlineStyle: "none",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  input2: {
    width: "90%",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    borderColor: "transparent",
    outlineStyle: "none",
  },
  group: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingRight: 10,
  },
  lock: {
    width: 20,
    height: 20,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  footerText: {
    color: "#fff",
    display: "flex",
  },
  createAccountText: {
    color: colors.primary,
    textDecorationLine: "none",
    marginLeft: 5,
  },
  info: {
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
