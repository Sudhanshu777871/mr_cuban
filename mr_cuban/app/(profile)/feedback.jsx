import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import img from "../../assets/img/login.jpg";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import { GetCommentAPI } from "../../api/order";
import { useSelector } from "react-redux";
import NoData from "../../components/NoData";

const Feedback = () => {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);

  const FetchComments = async () => {
    try {
      setLoading(true);

      const result = await GetCommentAPI(user?._id);
      if (result?.data?.data) {
        setState(result?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      FetchComments();
    }
  }, [user?._id]);

  return (
    <ImageBackground
      source={img}
      style={{ flex: 1, justifyContent: "center" }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", padding: 20 }}
      >
          <View style={styles.header}>
            <Text style={styles.h2}>
              <Text style={{ color: "#fff" }}>Driver</Text> Feedbacks
            </Text>
            <Text style={styles.p}>
              Your insights are invaluable in shaping our service.
            </Text>
          </View>
          {loading ? (
            <View style={styles.loader}>
              <Text style={{ color: colors.primary, fontSize: 30 }}>
                MR <Text style={{ color: colors.green }}>Cuban</Text>
              </Text>
              <Text>
                <ActivityIndicator color={"#fff"} size={"large"} />
              </Text>
            </View>
          ) : state?.length === 0 && loading === false ? (
            <NoData title={"No Rides"} />
          ) : (
            <FlatList
              data={state}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => <Card item={item} />}
              horizontal={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        
        <StatusBar backgroundColor="#000" style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "bold",
    color: colors.primary,
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
    marginTop: 10,
    marginBottom: 20,
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
    paddingRight: 10,
  },
  item: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 10,
  },
  card: {
    width: "100%",
    height: "fit-content",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    padding: 15,
    paddingBottom: 20,
    marginBottom:20
  },
  top: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profile: {
    width: 35,
    height: 35,
    backgroundColor: colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  comment: {
    color: "#fff",
    marginTop: 10,
    textTransform: "capitalize",
    textAlign: "justify",
    fontSize: 13,
    lineHeight: 20,
  },
  loader: {
    position: "absolute",
    flex: 1,
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    gap: 10,
  },
});

export const Card = ({ item }) => {
    const {rate,driver} = item;

  const rater = (rate) => {
    let temp = [];
    for (let index = 0; index < rate; index++) {
      temp.push("a");
    }
    return (
      <View
        style={{ display: "flex", flexDirection: "row", gap: 3, marginTop: 3 }}
      >
        {temp?.map((s, i) => (
          <AntDesign key={i} name="star" size={12} color={colors.primary} />
        ))}
      </View>
    );
  };
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.profile}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {String(driver?.name)[0]}
          </Text>
        </View>
        <View>
          <Text style={{ color: "#fff", fontSize: 14 }} numberOfLines={1}>
            {driver?.name}
          </Text>
          {rater(rate?.rating)}
        </View>
      </View>
      <View style={{display:"flex",flexDirection:"row",gap:5,marginTop:20,alignItems:"center"}}><AntDesign name="calendar" size={14} color="#fafafa" /><Text style={{color:"#fafafa"}}>
        {new Date(rate?.createdAt)?.toLocaleString()}
        </Text></View>
      <Text style={styles.comment}>
  {rate?.comment}
      </Text>
    </View>
  );
};
