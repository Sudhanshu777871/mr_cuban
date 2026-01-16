import {
  Alert,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import img from "../../assets/img/login.jpg";
import { useDispatch, useSelector } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {

  SendPushNotification,
} from "../../api/order";


const accout = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const openPrivacyPolicy = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Don't know how to open this URL: " + url);
    }
  };

  const handleLogout = async () => {
    AsyncStorage.removeItem("token");
    dispatch({ type: "logout", payload: "" });
    router.push("/");
  };


  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleLogout(),
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Text style={styles.h2}>Account Page</Text>
            <Text style={styles.p}>
              Your personal hub to update profile, enhance security, and tailor
              your app experience.
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <View style={styles.profile}>
              <Text style={styles.h4}>{String(user?.name)[0]}</Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 16, marginTop: 10 }}>
              {user?.name}
            </Text>
            <Text style={{ color: "#fff", fontSize: 16, marginTop: 5 }}>
              {user?.email}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: 20,
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/update-profile" })}
            >
              <View style={styles.link}>
                <Feather name="edit" size={18} color="#fff" />
                <Text style={styles.p}>Update Profile</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() => router.push("/aboutus")}
            >
              <View style={styles.link}>
                <Fontisto name="android" size={18} color="#fff" />
                <Text style={styles.p}>About App</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() => router.push("/feedback")}
            >
              <View style={styles.link}>
                <FontAwesome5 name="comments" size={18} color="#fff" />
                <Text style={styles.p}>Feedbacks</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() =>
                openPrivacyPolicy(
                  "https://www.privacypolicies.com/live/dfe8d4ff-f488-4761-8e2f-21fdc8b3052a"
                )
              }
            >
              <View style={styles.link}>
                <MaterialIcons name="policy" size={18} color="#fff" />
                <Text style={styles.p}>Privacy Policy</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() =>
                openPrivacyPolicy(
                  "https://mrcuban-terms-conditions.netlify.app/"
                )
              }
            >
              <View style={styles.link}>
                <MaterialCommunityIcons
                  name="newspaper-variant-outline"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.p}>Terms & Conditions</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmLogout()}
              style={{ width: "100%" }}
            >
              <View style={styles.link}>
                <MaterialCommunityIcons name="logout" size={24} color="#fff" />
                <Text style={styles.p}>Logout</Text>
              </View>
            </TouchableOpacity>
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
    color: "#fff",
    fontSize: 46,
    fontWeight: "bold",
    fontFamily: "bold",
  },
  p: {
    color: "#fff",
    textAlign: "justify",
    fontSize: 14,
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: 20,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.primary,
    borderWidth: 3,
  },
  link: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
  },
});
