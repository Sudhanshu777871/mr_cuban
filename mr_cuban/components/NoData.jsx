import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import img from "../assets/img/nodata.png";

const NoData = ({ title }) => {
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 10,
      }}
    >
        <View style={{width:250,height:250,borderRadius:100,}}>
        <Image style={{width:"90%",height:"90%",}} source={img} resizeMode="contain" />
        </View>
      
      <Text style={{color:"#fff"}}>{title}</Text>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({});
