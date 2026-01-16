import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../assets/color";

const RatingCardBig = ({ item, index }) => {
  const [star, setStar] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    // Check if the number of lines is greater than 2 to show "Read More"
    if (lines.length > 2) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  };

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < Number(item?.rate?.rating); i++) {
      temp.push(i);
    }
    setStar(temp);
  }, []);

  return (
    <View style={styles.model_card} key={item?._id}>
      <View style={styles.head}>
        <View style={styles.left}>
          <View style={styles.c}>
            <Text style={styles.ct}>{String(item?.user?.name)[0]}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text numberOfLines={1} style={styles.h5}>
            {item?.user?.name}
          </Text>
          <View style={styles.star}>
            {star.map((d) => (
              <AntDesign key={d} name="star" size={14} color={"orange"} />
            ))}
          </View>
        </View>
      </View>

      <Text
        style={styles.text}
        numberOfLines={showFullText ? null : 2}
        ellipsizeMode="tail"
        onTextLayout={onTextLayout}
      >
        {item?.rate?.comment}
      </Text>
      {isTruncated && (
        <TouchableOpacity onPress={toggleText}>
          <Text style={styles.readMore}>
            {showFullText ? "Read Less" : "Read More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RatingCardBig;

const styles = StyleSheet.create({
  model_card: {
    width: "100%",
    backgroundColor: "whitesmoke",
    height: "fit-content",
    marginRight: 10,
    borderRadius: 8,
    position: "relative",
    padding: 15,
    marginBottom:20
  },
  head: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  left: {
    width: 20,
  },
  c: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  ct: {
    color: "#fff",
    fontWeight: "bold",
  },

  star: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  text: {
    color: "#454545",
    fontSize: 13,
    lineHeight: 18,
    width: "100%",
    marginTop: 10,
    textAlign: "justify",
    // flexGrow:0
  },
  readMore: {
    marginTop: 5,
  },
  h5: {
    marginBottom: 3,
  },
});
