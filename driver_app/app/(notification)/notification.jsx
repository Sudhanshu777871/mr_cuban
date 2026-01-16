import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import img from "../../assets/img/bell.png";
import { colors } from "../../assets/color";
import img2 from "../../assets/img/noletter.png";
import { GetAllNotifications } from "../../api/other";
import { useSelector } from "react-redux";
import Fontisto from "@expo/vector-icons/Fontisto";

const notification = () => {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);

  const FetchNotifications = async () => {
    try {
      setLoading(true);

      const result = await GetAllNotifications(user?._id);
      if (result?.data?.data) {
        setState(result?.data?.data);
      } else {
        setState([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) FetchNotifications();
  }, [user?._id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={styles.h1}>Notifications</Text>
      <Text style={styles.p}>
        Manage rides, track earnings, and get real-time updates to maximize your
        driving experience with Mr Cuban Partners App.
      </Text>

      <View style={styles.list}>
        {loading ? (
          <View style={styles.loader}>
            <Text style={{ color: "#000", fontSize: 20 }}>
              MR Cuban Partners
            </Text>
            <ActivityIndicator size={50} color={colors.primary} />
          </View>
        ) : state?.length === 0 && loading === false ? (
          <View style={styles.no}>
            <Image
              source={img2}
              resizeMode="contain"
              style={{ width: 300, height: 300, objectFit: "contain" }}
            />
            <Text
              style={{ color: "#454545", fontSize: 14, fontWeight: "bold" }}
            >
              No Notification Yet
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#454545",
                fontSize: 13,
                marginTop: 5,
              }}
            >
              Your notification will appear here once you've recived them.
            </Text>
          </View>
        ) : (
          <FlatList
            data={state}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => <ListComponent item={item} />}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default notification;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "fit-content",
    borderWidth: 1,
    borderColor: "whitesmoke",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexDirection: "row",
    padding: 5,
    marginBottom: 10,
  },
  left: {
    width: "20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    width: "80%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingRight: 5,
  },
  ps: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  p: {
    color: "#454545",
    lineHeight: 18,
    textAlign: "justify",
  },
  readMore: {
    marginTop: 5,
    color: "#454545",
  },
  list: {
    marginTop: 20,
    flex: 1,
  },
  h1: {
    color: colors.primary,
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
  },
  no: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 5,
  },
});

export const ListComponent = ({ item }) => {
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

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={{width:50,height:50,borderRadius:50,backgroundColor:"whitesmoke"}}>
          <Image
            style={{
              width: "100%",
              height:"100%",
              objectFit: "cover",
              
            }}
            source={img}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.ps}>{item?.title}</Text>
        <View
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Fontisto name="date" size={12} color="#454545" />
          <Text>{new Date(item?.createdAt)?.toLocaleDateString()}</Text>
        </View>
        <Text
          style={styles.p}
          numberOfLines={showFullText ? null : 2}
          ellipsizeMode="tail"
          onTextLayout={onTextLayout}
        >
          {item?.message}
        </Text>

        {isTruncated && (
          <TouchableOpacity onPress={toggleText}>
            <Text style={styles.readMore}>
              {showFullText ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
