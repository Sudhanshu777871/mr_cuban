import {
  
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, {  useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../assets/color";
import AuthButton from "../../components/AuthButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ForgotPasswordAPI } from "../../api/auth";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const hadleSubmit = async () => {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email === "") {
        return ToastAndroid.show("Email is required", ToastAndroid.SHORT);
      }

      if (!emailPattern.test(email)) {
        return ToastAndroid.show("Invalid email address", ToastAndroid.SHORT);
      }
      setLoading(true);
      const result = await ForgotPasswordAPI(email);
      if (result?.data?.data) {
        ToastAndroid.show(
          "OTP send to your register email address Successfull",
          ToastAndroid.SHORT
        );
        router.push({
          pathname: "/reset",
          params: {
            email: email,
          },
        });
      } else {
        ToastAndroid.show("OTP failed to send", ToastAndroid.SHORT);
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
    
      <View style={styles.layer}>
        <Text style={styles.p2}>
          Forgot Password{" "}
          <Text
            style={{
              color: colors.primary,
              fontFamily: "bold",
              fontWeight: "bold",
            }}
          >
            MR{" "}CUBAN{" "}
            <Text
              style={{
                color: colors.green,
                fontFamily: "bold",
                fontWeight: "bold",
              }}
            >
              PARTNERS
            </Text>
          </Text>
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Register Email</Text>
          <TextInput
            style={[styles.input1]}
            placeholder="Enter Email Address"
            onChangeText={(e) => setEmail(e)}
            placeholderTextColor={"gray"}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            We’ll send a verification code to this email if it matches an
            existing Mr Cuban Partners account.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.createAccountText}>Back to Login page?</Text>
          </TouchableOpacity>
        </View>

        <AuthButton
          loading={loading}
          title="Submit"
          handlePress={() => hadleSubmit()}
        />
      </View>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Forget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layer: {
    
    backgroundColor: "#fff",
    flex: 1,
    display: "flex",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
  },
  heading: {
    fontWeight: "bold",
    fontFamily: "bold",
    fontSize: 40,
    color: colors.primary,
  },

  p2: {
    width: "100%",
    color: "#000",
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
    color: "#454545",
    fontSize: 16,
    fontFamily: "regular",
  },
  input1: {
    width: "100%",
    color: "#454545",
    padding: 10,
    borderRadius: 5,
    borderColor: "#e4e4e4",
    outlineStyle: "none",
    backgroundColor: "#fff",
    borderWidth:1
  },

  footer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  footerText: {
    color: "#454545",
    display: "flex",
  },
  createAccountText: {
    color: "#454545",
    textDecorationLine: "none",
    marginTop: 5,
  },
});
