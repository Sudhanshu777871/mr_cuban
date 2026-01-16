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
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


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
    router.push("/sign-in");
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
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
          <Text style={{ color: "#454545", fontSize: 16, marginTop: 10 }}>
            {user?.name}
          </Text>
          <Text style={{ color: "#454545", fontSize: 16, marginTop: 5 }}>
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
          }}
        >
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => router.push({ pathname: "/update-profile" })}
          >
            <View style={styles.link}>
              <Feather name="edit" size={18} color="#808080" />
              <Text style={styles.p}>Update Profile</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => router.push({ pathname: "/add-ride" })}
          >
            <View style={styles.link}>
              <AntDesign name="car" size={18} color="#808080" />
              <Text style={styles.p}>Add Vehicles</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => router.push({ pathname: "/rides" })}
          >
            <View style={styles.link}>
              <AntDesign name="car" size={18} color="#808080" />
              <Text style={styles.p}>View Vehicles</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => router.push({ pathname: "/comment" })}
          >
            <View style={styles.link}>
            <FontAwesome5 name="comments" size={18} color="#808080" />
             <Text style={styles.p}>Comments</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => router.push("/aboutus")}
          >
            <View style={styles.link}>
              <Fontisto name="android" size={18} color="#808080" />
              <Text style={styles.p}>About App</Text>
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
              <MaterialIcons name="policy" size={18} color="#808080" />
              <Text style={styles.p}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => openPrivacyPolicy("https://mrcuban-terms-conditions.netlify.app/")}
          >
            <View style={styles.link}>
              <MaterialCommunityIcons
                name="newspaper-variant-outline"
                size={18}
                color="#808080"
              />
              <Text style={styles.p}>Terms & Conditions</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => confirmLogout()}
            style={{ width: "100%" }}
          >
            <View style={styles.link}>
              <MaterialCommunityIcons name="logout" size={18} color="#808080" />
              <Text style={styles.p}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default accout;

const styles = StyleSheet.create({
  header: {
    margin: 0,
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
    color: "#454545",
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
    backgroundColor: "#000",
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
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
