import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/Card";
import { GetLeads } from "../../api/order";
import img from "../../assets/img/taxi-app.gif"
import img2 from "../../assets/img/noorder.png";

const Offers = () => {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);


  const FetchRequests = async () => {
    try {
      setLoading(true);

      const result = await GetLeads();
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
    // Function to fetch requests
    const fetchRequests = () => {
      FetchRequests();
    };
  

    // Initial fetch
    fetchRequests();
  
    // Set interval for fetching requests every 5 seconds
    const intervalId = setInterval(fetchRequests, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text
        style={{
          color: "#000",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 20,
          marginBottom: 15,
        }}
      >
        Request
      </Text>

      {loading ? (
 <View style={styles.no}>
 <Image
   source={img}
   resizeMode="contain"
   style={{ width: 300, height: 300, objectFit: "contain" }}
 />

</View>
      ) : state?.length === 0 && loading === false ? (
        <View style={styles.no}>
          <Image
            source={img2}
            resizeMode="contain"
            style={{ width: 300, height: 300, objectFit: "contain" }}
          />
          <Text style={{ color: "#454545", fontSize: 14, fontWeight: "bold" }}>
            No Orders Yet
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#454545",
              fontSize: 13,
              marginTop: 5,
            }}
          >
This area will show your order leads once they are available.
</Text>
        </View>
      ) : (
        <FlatList
          data={state}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => <Card item={item} />}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Offers;

const styles = StyleSheet.create({
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
