import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../assets/color";
import { GetCurrentOrdersAPI, GetHistoryOrdersAPI } from "../api/order";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import NoData from "./NoData";
import OrderCard from "./OrderCard";

const HistoryOrder = () => {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [phone, setPhone] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false); // For additional page load

  const dispatch = useDispatch();

  const FetchRides = async () => {
    try {
      setLoading(true);
      const result = await GetHistoryOrdersAPI(current, user?._id);
      if (result?.data?.data) {
        if (current === 1) {
          setState(result?.data?.data?.data);
          setTotal(result?.data?.data?.total);
          setPhone(result?.data?.data?.user);
        } else {
          setState((prev) => [...prev, result?.data?.data?.data]);
          setTotal((prev) => [...prev, result?.data?.data?.total]);
          setPhone((prev) => [...prev, result?.data?.data?.user]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    FetchRides();
  }, [current]);

  // Function to fetch more rides when reaching the end of the list
  const fetchMoreRides = () => {
    if (!isFetchingMore && state.length < total) {
      setIsFetchingMore(true);
      setCurrent((prevPage) => prevPage + 1); // Increment page number
    }
  };

  return (
    <View style={styles.flat}>
      {loading ? (
        <View style={styles.loader}>
          <Text style={{ color: colors.primary, fontSize: 30 }}>
            MR <Text style={{ color: colors.green }}>Cuban</Text>
          </Text>
          <Text>
            <ActivityIndicator color={colors.primary} size={"large"} />
          </Text>
        </View>
      ) : state?.length === 0 && loading === false ? (
        <NoData title={"No Rides Available"} />
      ) : (
        <FlatList
          data={state}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                dispatch({
                  type: "orderDetail",
                  payload: { d: item, p: phone[index] },
                });
                router.push({
                  pathname: "/order-detail",
                });
              }}
              key={item?.price + index}
            >
              <OrderCard item={item} />
            </TouchableOpacity>
          )}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          onEndReached={fetchMoreRides} // Trigger fetch when end is reached
          onEndReachedThreshold={0.5} // Trigger when scrolled 50% from the bottom
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : null
          } // Show loading indicator at the end of the list
        />
      )}
    </View>
  );
};

export default HistoryOrder;

const styles = StyleSheet.create({
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
  flat: {
    marginTop: 50,
    flex: 1,
  },
});
