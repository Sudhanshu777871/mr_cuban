import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../assets/color";
import AuthButton from "../components/AuthButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LoadApi } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import img1 from "../assets/img/s1.png";
import img2 from "../assets/img/s2.png";
import img3 from "../assets/img/s3.png";

const RooyLayout = () => {
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();
  const images = [img1, img2, img3];

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      await AsyncStorage.setItem("appVersion","1.0.0");
      await AsyncStorage.setItem("appFor","Driver");
      if (!token) {
        return router.replace("/sign-in");
      }
      const result = await LoadApi(token);
      if (result?.data?.data) {
        dispatch({
          type: "load",
          payload: { data: result?.data?.data, total: result?.data?.total },
        });
        dispatch({type:"force_call",payload:true})
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

  useEffect(() => {
    // Set an interval to change the image every 5 seconds (5000 ms)
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {loading === true ? (
          <View style={styles.loader}>
            <Text style={styles.heading}>
              MR Cuban{" "}
              <Text style={{ color: colors.primary }}>Partners App</Text>
            </Text>
            <Text>
              <ActivityIndicator color={colors.primary} size={"large"} />
            </Text>
          </View>
        ) : (
          <View style={styles.layer}>
            <View style={styles.welcome}>
              <Image
                style={{ width: 400, height: 200, objectFit: "contain" }}
                source={images[currentImageIndex]}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.heading}>
              MR Cuban{" "}
              <Text style={{ color: colors.primary }}>Partners App</Text>
            </Text>
            <Text style={styles.p}>
              We’re thrilled to have you as part of the MR Cuban driving
              community. With our app, you’ll be able to connect with customers,
              accept rides, and earn money on your terms.
            </Text>
            <AuthButton
              title="Continue with Email"
              handlePress={() => router.push("/sign-in")}
            />
          </View>
        )}
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
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
    backgroundColor: "#fff",
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
  },
  heading: {
    fontFamily: "bold",
    fontWeight: "bold",
    fontSize: 30,
    color: "#000",
  },
  p: {
    color: "#454545",
    textAlign: "justify",
    fontSize: 14,
    fontFamily: "regular",
    marginTop: 10,
  },
  loader: {
    position: "absolute",
    backgroundColor: "#fff",
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
    gap: 10,
  },
  welcome: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
});
