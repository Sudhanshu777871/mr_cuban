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
import { GetCurrentOrdersAPI } from "../api/order";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import NoData from "./NoData";
import OrderCard from "./OrderCard";

const CurrentOrder = () => {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();

  const FetchRides = async () => {
    try {
      setLoading(true);
      const result = await GetCurrentOrdersAPI(current, user?._id);
      if (result?.data?.data) {
        setState(result?.data?.data?.data);
        setTotal(result?.data?.data?.total);
        setPhone(result?.data?.data?.user);
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
                  payload:{d:item,p:phone[index]}
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
        />
      )}
    </View>
  );
};

export default CurrentOrder;

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
