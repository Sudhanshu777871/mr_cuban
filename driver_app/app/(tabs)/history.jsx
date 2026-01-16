import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";

import CurrentOrder from "../../components/CurrentOrder";
import HistoryOrder from "../../components/HistoryOrder";

const history = () => {
  const [state, setState] = useState("current");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <View style={{ width: "100%", }}>
        <Text
          style={{
            color: "#454545",
            fontSize: 25,
            fontWeight: "bold",
            fontFamily: "bold",
          }}
        >
          Order History
        </Text>
        <Text
          style={{
            color: "#454545",
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
    </SafeAreaView>
  );
};

export default history;

const styles = StyleSheet.create({

  tab:{
    width:"100%",
    marginTop:15,
    display:"flex",
    flexDirection:"row",
    gap:10
  },
  tab1:{
    padding:10,
    borderRadius:5,
    backgroundColor:"#000",
  
  },
  tab_p:{
    color:"#fff"
  },
  active:{
    padding:10,
    borderRadius:5,
    backgroundColor:colors.primary,
  }




});
