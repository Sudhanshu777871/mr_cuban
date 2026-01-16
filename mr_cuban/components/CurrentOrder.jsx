import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../assets/color";
import { GetCurrentOrdersAPI } from "../api/order";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import NoData from "./NoData";

const CurrentOrder = () => {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [isEndReached, setIsEndReached] = useState(false);

  const dispatch = useDispatch();



  const FetchRides = async () => {
    try {
      setLoading(true);
      const result = await GetCurrentOrdersAPI(current, user?._id);
      if (result?.data?.data) {
        setState(result?.data?.data);
        setTotal(result?.data?.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchRides();
  }, [current]);

  return (
    <View style={styles.flat}>
      {loading ? (
        <View style={styles.loader}>
          <Text style={{ color: colors.primary, fontSize: 30 }}>
            MR <Text style={{ color: colors.green }}>Cuban</Text>
          </Text>
          <Text>
            <ActivityIndicator color={"#fff"} size={"large"} />
          </Text>
        </View>
      ) : state?.length===0 && loading===false ? <NoData title={"No Rides"}/>:(
        <FlatList
          data={state}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                dispatch({ type: "addOrder", payload: item });
                router.push({
                  pathname: "/order-detail",
                });
              }}
              key={item?.price + index}
            >
              <BlurView
                intensity={95}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 20,
                  overflow: "hidden",
                }}
              
              >
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <View style={styles.left}>
                    <View style={styles.line}>
                      <Text style={styles.h5}>Pickup Location</Text>
                      <Text
                        style={styles.h2}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item?.distance1}
                      </Text>
                    </View>
                    <View style={styles.line}>
                      <Text style={styles.h5}>Drop Location</Text>
                      <Text
                        style={styles.h2}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item?.distance2}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.right}>
                    <Text style={styles.p3}> ₹{item.price}</Text>
                  </View>
                </View>
                <View style={styles.status}>
                  <Text style={styles.km}>{item?.type}</Text>
                  <Text
                    style={
                      item?.status === "complete"
                        ? styles.g
                        : item?.status === "accept"
                        ? styles.y
                        : styles.r
                    }
                  >
                    {item?.status === "accept"
                      ? "In Progress"
                      : item?.status === "complete"
                      ? "Complete"
                      : item?.status==="start" ? "Start": "Cancel"}
                  </Text>
                  <Text style={styles.km}>{item?.date1?.split(" ")[0]}</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          )}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          
        />
      )}
    </View>
  );
};

export default CurrentOrder;

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
  y: {
    color: "#f59e0b",
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
