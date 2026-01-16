import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import img from "../../assets/img/login.jpg";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";


const AboutUs = () => {
  

  return (
    <ImageBackground
      source={img}
      style={{ flex: 1, justifyContent: "center" }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Text style={styles.h2}>
              <Text style={{ color: "#fff" }}>About</Text> Mr Cuban
            </Text>
            <Text style={styles.p}>
              <Text style={{ fontFamily: "bold", color: colors.primary }}>
                Welcome to Mr Cuban
              </Text>
              , your reliable car booking app designed to make transportation
              easy, fast, and convenient. Whether you're commuting to work,
              heading out for a night on the town, or catching a flight, Mr
              Cuban is here to get you where you need to go.
            </Text>
            <Text style={styles.p1}>
              With just a few taps, you can enter your start and end addresses
              and book a car instantly. We offer a seamless booking experience,
              ensuring that you reach your destination comfortably and on time.
            </Text>

            <Text style={{ color: "#fff", marginTop: 10, fontSize: 15 }}>
              Why Choose{" "}
              <Text style={{ color: colors.primary }}>Mr Cuban?</Text>
            </Text>

            <View style={styles.list}>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  Simple & Fast: Enter your pick-up and drop-off locations, and
                  book a ride in seconds.
                </Text>
              </View>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  Reliable Drivers: Professional and friendly drivers to ensure
                  a safe and comfortable journey.
                </Text>
              </View>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  Real-Time Tracking: Track your car and arrival time in
                  real-time to stay updated on your trip.
                </Text>
              </View>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  24/7 Availability: Book a car any time of day or night,
                  whenever you need it.
                </Text>
              </View>
            </View>
            <Text style={styles.p}>
              At Mr Cuban, we believe in making travel hassle-free and
              affordable. Whether you're booking a quick trip across town or a
              longer ride, we’ve got you covered.
            </Text>

            <Text style={styles.p}>Thank you for choosing Mr Cuban—your ride, your way.</Text>
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#000" style="light" />

      </SafeAreaView>
    </ImageBackground>
  );
};

export default AboutUs;

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
    fontSize: 15,
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: 22,
    marginTop: 15,
  },
  p1: {
    color: "#fff",
    textAlign: "justify",
    fontSize: 15,
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: 22,
  },
  list: {
    width: "100%",
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingRight:10
  },
  item: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight:10
  },
});
