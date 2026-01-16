import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {  GetRides } from "../../api/other";
import { useSelector } from "react-redux";
import RatingCard3 from "../../components/RatingCard3";
import { colors } from "../../assets/color";
import img2 from "../../assets/img/noletter.png";


const rides = () => {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const result = await GetRides(user?._id);
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

  console.log(state);

  useEffect(() => {
    if (user?._id) {
      fetchRecords();
    }
  }, [user?._id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={styles.h2}>Registered Vehicles</Text>
      <Text style={styles.p3}>
        We value each registered vehicle and proudly display the complete list
        on our platform for easy access and visibility.
      </Text>
      <View style={styles.model}>
        {loading ? (
          <FlatList
            vertical
            data={[1, 2, 3, 4]}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => <RatingCard3 flag={true} />}
            showsVerticalScrollIndicator={false}
          />
        ) : loading === false && state?.length === 0 ? (
          <View style={styles.no}>
            <Image
              source={img2}
              resizeMode="contain"
              style={{ width: 300, height: 300, objectFit: "contain" }}
            />
            <Text
              style={{ color: "#454545", fontSize: 14, fontWeight: "bold" }}
            >
              Vehicle Registration Required
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#454545",
                fontSize: 13,
                marginTop: 5,
              }}
            >
              No vehicles are currently registered. Please add a vehicle to
              continue.
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 10 }}
            vertical
            data={state}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Text style={styles.h4}>{item?.modelName}</Text>
                <Text style={styles.p}>
                  Registration Number: {item?.modelNumber}
                </Text>
                <Text style={styles.p}>Total Seat: {item?.seat}</Text>
                <Text style={styles.p}>
                  Status: {item?.status === true ? "Active" : "Inactive"}
                </Text>
                <View style={styles.images}>
                  {item?.img?.map((d) => (
                    <Image
                      key={d?.public_id}
                      source={{ uri: d?.url }}
                      style={{ width: 50, height: 50, borderRadius: 3 }}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default rides;

const styles = StyleSheet.create({
  h2: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  p3: {
    color: "#454545",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    lineHeight: 20,
  },
  model: {
    marginTop: 15,
    flex: 1,
  },
  card: {
    width: "100%",
    height: "fit-content",
    backgroundColor: "whitesmoke",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  h4: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  p: {
    fontSize: 14,
  },
  images: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  no: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
