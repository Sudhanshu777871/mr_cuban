import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../assets/color";
import AuthButton from "../../components/AuthButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterApi } from "../../api/auth";
import { useDispatch } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";

const SignUp = () => {
  const [show, setShow] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobilePattern = /^[0-9]{10}$/;
      const dlPattern = /^[A-Z]{2}[0-9]{2}[0-9]{7}$/;

      if (name === "")
        return ToastAndroid.show("Name is Required", ToastAndroid.SHORT);

      if (email === "")
        return ToastAndroid.show("Email is Required", ToastAndroid.SHORT);

      if (!emailPattern.test(email)) {
        return ToastAndroid.show("Invalid email address", ToastAndroid.SHORT);
      }

      if (phone === "")
        return ToastAndroid.show("Phone is Required", ToastAndroid.SHORT);

      if (!mobilePattern.test(phone)) {
        return ToastAndroid.show("Invalid mobile number", ToastAndroid.SHORT);
      }

      if (license === "")
        return ToastAndroid.show(
          "License Number is Required",
          ToastAndroid.SHORT
        );

      if (password === "")
        return ToastAndroid.show("Password is Required", ToastAndroid.SHORT);

      if (password.length < 6) {
        return ToastAndroid.show("Password is too short", ToastAndroid.SHORT);
      }

      if (password.length > 16) {
        return ToastAndroid.show("Password is too long", ToastAndroid.SHORT);
      }

      setLoading(true);
      const result = await RegisterApi(name, email, phone, password, license);

      if (result?.data?.data) {

        ToastAndroid.show(
          "Registration Successful! Your account is under verification by the administration team. Once verified, you will receive an email to log in.",
          ToastAndroid.SHORT
        );
        router.push("/sign-in");
      } else {
        ToastAndroid.show("Registration Failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error, "oooo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View style={styles.layer}>
          <Text style={styles.p2}>
            Register to{" "}
            <Text
              style={{
                color: colors.primary,
                fontFamily: "bold",
                fontWeight: "bold",
              }}
            >
              MR CUBAN{" "}
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
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input1]}
              placeholder="Enter Your Name"
              onChangeText={(e) => setName(e)}
              value={name}
              placeholderTextColor={"gray"}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input1]}
              placeholder="Enter Email Address"
              onChangeText={(e) => setEmail(e.trim())}
              value={email}
              placeholderTextColor={"gray"}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input1]}
              placeholder="Enter Phone Number"
              onChangeText={(e) => setPhone(e)}
              value={phone}
              placeholderTextColor={"gray"}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Driving License</Text>
            <TextInput
              style={[styles.input1]}
              placeholder="Enter License Number"
              onChangeText={(e) => setLicense(e)}
              value={license}
              placeholderTextColor={"gray"}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.group}>
              <TextInput
                style={styles.input2}
                placeholder="Enter Password"
                secureTextEntry={show}
                value={password}
                onChangeText={(e) => setPassword(e)}
                placeholderTextColor={"gray"}
              />
              {show ? (
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Entypo name="eye-with-line" size={18} color="#454545" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setShow(true)}>
                  <Entypo name="eye" size={18} color="#454545" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}> Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text style={styles.createAccountText}>Log In</Text>
            </TouchableOpacity>
          </View>

          <AuthButton
            title="Register"
            handlePress={() => handleRegister()}
            loading={loading}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default SignUp;

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
    fontSize: 50,
    color: colors.primary,
  },

  p2: {
    width: "100%",
    color: "#000",
    fontSize: 18,
    fontFamily: "regular",
    marginBottom: 20,
    fontWeight: "regular",
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
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  input2: {
    width: "90%",
    color: "#454545",
    padding: 10,
    borderRadius: 5,
    borderColor: "transparent",
    outlineStyle: "none",
  },
  group: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "#e4e4e4",
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
    color: "#454545",
    display: "flex",
  },
  createAccountText: {
    color: colors.primary,
    textDecorationLine: "none",
    marginLeft: 5,
  },
});
