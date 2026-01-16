import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "../assets/color";

const AutocompleteText = ({ setPickup, setPickupAutocomplete, d }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setPickup(d);
        setPickupAutocomplete(false);
      }}
    
    >
      <View style={styles.wrap}>
        <Feather
          name="map-pin"
          size={14}
          color={colors.primary}
          style={{ marginTop: 2 }}
        />
        <Text style={styles.text}>{d} </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AutocompleteText;

const styles = StyleSheet.create({
  wrap: {
    display: "flex",
    alignItems: "start",
    gap: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 15,
    wordBreak: "break-word",
    flexWrap: "wrap",
    paddingRight: 5,
  },
});
