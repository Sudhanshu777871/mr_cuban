import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../assets/color";
import img from "../assets/img/login.jpg";
import AuthButton from "../components/AuthButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LoadApi } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

const RooyLayout = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      await AsyncStorage.setItem("appVersion","1.0.0");
      await AsyncStorage.setItem("appFor","Customer");
      if(!token){
        return router.replace("/sign-in")
      }
      const result = await LoadApi(token);
  
      if (result?.data?.data) {
        dispatch({ type: "load", payload: result?.data?.data });
        router.replace("/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    
    fetchUserDetails();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Image
          source={img}
          style={{ flex: 1, position: "relative" }}
          resizeMode="cover"
        />
        {loading===true ? (
          <View style={styles.loader}>
            <Text style={{ color: colors.primary,fontSize:30 }}>
              MR <Text style={{ color: colors.green }}>Cuban</Text>
            </Text>
            <Text>
              <ActivityIndicator color={"#fff"} size={"large"} />
            </Text>
          </View>
        ) : (
          <View style={styles.layer}>
            <Text style={styles.heading}>
              MR <Text style={{ color: colors.green }}>Cuban</Text>
            </Text>
            <Text style={styles.p}>
              Welcome to MR Cuban, your ultimate destination for seamless and
              stylish car bookings. Your ride, your way – just a tap away!
            </Text>
            <AuthButton
              title="Continue with Email"
              handlePress={() => router.push("/sign-in")}
            />
          </View>
        )}
      </ScrollView>
      <StatusBar backgroundColor="#000" style="light" />
    </SafeAreaView>
  );
};

export default RooyLayout;

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
    fontFamily: "bold",
    fontWeight: "bold",
    fontSize: 40,
    color: colors.primary,
  },
  p: {
    color: "#fff",
    textAlign: "justify",
    fontSize: 14,
    fontFamily: "regular",
    marginTop: 10,
  },
  loader:{
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
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
    gap:10
  }
});
