import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import img from "../../assets/img/login.jpg";
import AuthButton from "../../components/AuthButton";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";

const AboutUs = () => {

  return (
  
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Text style={styles.h2}>
              <Text style={{ color: "#000" }}>About</Text> Mr Cuban Partners
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

            <Text style={{ color: "#000", marginTop: 10, fontSize: 15 }}>
              Why Choose{" "}
              <Text style={{ color: colors.primary }}>Mr Cuban?</Text>
            </Text>

            <View style={styles.list}>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  <Text style={{color:"#000",fontWeight:"bold"}}>
                  Simple & Fast:</Text> Enter your pick-up and drop-off locations, and
                  book a ride in seconds.
                </Text>
              </View>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  <Text style={{color:"#000",fontWeight:"bold"}}>
                    Reliable Drivers:</Text> Professional and friendly drivers to ensure
                  a safe and comfortable journey.
                </Text>
              </View>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  <Text style={{color:"#000",fontWeight:"bold"}}>
                  Real-Time Tracking:</Text> Track your car and arrival time in
                  real-time to stay updated on your trip.
                </Text>
              </View>
              <View style={styles.item}>
                <AntDesign name="star" size={14} color={colors.primary} />
                <Text style={styles.p}>
                  {" "}
                  <Text style={{color:"#000",fontWeight:"bold"}}>
                  24/7 Availability:</Text> Book a car any time of day or night,
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
      </SafeAreaView>

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
    color: "#454545",
    fontSize: 16,
    fontWeight: "regular",
    fontFamily: "regular",
    marginBottom: 15,
  },
  p: {
    color: "#454545",
    textAlign: "justify",
    fontSize: 15,
    fontWeight: "regular",
    fontFamily: "regular",
    lineHeight: 22,
    marginTop: 15,
  },
  p1: {
    color: "#454545",
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
