import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import img from "../../assets/img/login.jpg";
import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";

import CurrentOrder from "../../components/CurrentOrder";
import HistoryOrder from "../../components/HistoryOrder";
import { StatusBar } from "expo-status-bar";

const history = () => {
  const [state, setState] = useState("current");

  return (
    <ImageBackground
      source={img}
      style={{ flex: 1, justifyContent: "center" }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: "100%", padding: 20, paddingBottom: 10 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 25,
              fontWeight: "bold",
              fontFamily: "bold",
            }}
          >
            Order History
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: 400,
              fontFamily: "regular",
              marginTop: 10,
            }}
          >
            View your order history and manage past rides.
          </Text>
        </View>

        <View style={styles.tab}>
          <TouchableOpacity
            style={state === "current" ? styles.active : styles.tab1}
            onPress={() => setState("current")}
          >
            <Text style={styles.tab_p}>Current Rides</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={state === "history" ? styles.active : styles.tab1}
            onPress={() => setState("history")}
          >
            <Text style={styles.tab_p}>History Rides</Text>
          </TouchableOpacity>
        </View>
        {state === "current" ? <CurrentOrder /> : <HistoryOrder />}
        <StatusBar backgroundColor="#000" style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default history;

const styles = StyleSheet.create({
  line: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    alignItems: "flex-start",
    width: "100%",
    overflow: "hidden",
  },
  h5: {
    color: "#000",
    fontWeight: "bold",
    fontFamily: "bold",
  },
  wrap: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  sm: {
    color: "gray",
    fontSize: 12,
    fontWeight: "regular",
  },
  p: {
    color: "#fff",
    fontSize: 14,
    overflow: "hidden",
    fontWeight: "regular",
    fontFamily: "regular",
  },
  flat: {
    flex: 1,
    padding: 20,
  },
  h2: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "regular",
    fontWeight: "regular",
    marginBottom: 2,
  },

  p3: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "bold",
    fontWeight: "bold",
    marginBottom: 5,
  },
  status: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  g: {
    color: colors.green,
    fontWeight: "bold",
    fontFamily: "bold",
    fontSize: 18,
    textTransform: "capitalize",
  },
  r: {
    color: "red",
    fontWeight: "bold",
    fontFamily: "bold",
    fontSize: 18,
    textTransform: "capitalize",
  },
  km: {
    color: "#fff",
    textAlign: "left",
    justifyContent: "flex-start",
  },
  left: {
    width: "80%",
  },
  tab: {
    paddingLeft: 20,
    marginTop: 10,
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  active: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tab1: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tab_p: {
    color: "#fff",
    fontWeight: "regular",
    fontFamily: "regular",
  },
});
