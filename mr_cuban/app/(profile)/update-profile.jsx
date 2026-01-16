import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import img from "../../assets/img/login.jpg";
import AuthButton from "../../components/AuthButton";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadApi, UpdateUserApi } from "../../api/auth";
import { StatusBar } from "expo-status-bar";


const accout = () => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const result = await UpdateUserApi(name, password,user?.phone, user?._id,token);
      if (result?.data?.data) {
        const result1 = await LoadApi(token);
        if (result1?.data?.data) {
          dispatch({ type: "load", payload: result?.data?.data });
          ToastAndroid.show("Profile Update Successfully", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    setPassword(user?.password);
    setName(user?.name);
  }, [user]);

  return (
    <ImageBackground
      source={img}
      style={{ flex: 1, justifyContent: "center" }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Text style={styles.h2}>Profile Page</Text>
            <Text style={styles.p}>
              Welcome to your profile! Here, you can manage your account
              details, view your booking history, and update your preferences.
            </Text>
          </View>

          <Text style={styles.h4}>Personal Details</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#fff"}
              value={name}
              onChangeText={(e)=>setName(e)}
              placeholder="Enter Your Name"
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#fff"}
              value={user?.email}
              placeholder="Enter Your Email"
              editable={false}
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#fff"}
              value={password}
              onChangeText={(e)=>setPassword(e)}
              placeholder="Enter Your Password"
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#fff"}
              value={user?.phone}
              placeholder="Enter Your Phone Number"
              editable={false}
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>OTP</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#fff"}
              value={user?.accountOtp}
              editable={false}
            />
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <AuthButton loading={loading} handlePress={handleUpdate} title={"Update Profile"} />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#000" style="light" />

      </SafeAreaView>
    </ImageBackground>
  );
};

export default accout;

const styles = StyleSheet.create({
  header: {
    margin: 20,
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  h4: {
    paddingLeft: 20,
    color: "#fff",
    fontSize: 16,
    fontWeight: "regular",
    fontFamily: "regular",
    marginBottom: 15,
  },
  p: {
    color: "#fff",
    textAlign: "justify",
    fontSize: 14,
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: 20,
  },
  form: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "regular",
    fontFamily: "regular",
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    color: "#fff",
    outlineStyle: "none",
    marginTop: 5,
  },
});
