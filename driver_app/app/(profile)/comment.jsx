import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetAllCommentsAPI } from "../../api/other";
import { useSelector } from "react-redux";
import RatingCard from "../../components/RatingCard";
import RatingCard2 from "../../components/RatingCard2";
import RatingCard3 from "../../components/RatingCard3";
import { colors } from "../../assets/color";
import RatingCardBig from "../../components/RatingCardBig";

const comment = () => {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const result = await GetAllCommentsAPI(user?._id);
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
    if (user?._id) {
      fetchRecords();
    }
  }, [user?._id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
        <Text style={styles.h2}>Customer Feedbacks</Text>
        <Text style={styles.p3}>
          We value every comment and rating from our valued customers and
          showcase the top feedback on our platform.
        </Text>
      <View style={styles.model}>
          {loading ? (
            <FlatList
              vertical
              data={[1, 2, 3,4]}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => <RatingCard3 flag={true} />}
              showsVerticalScrollIndicator={false}
            />
          ) : loading === false && state?.length === 0 ? (
            <RatingCard2 />
          ) : (
            <FlatList
            contentContainerStyle={{paddingBottom:10}}
              vertical
              data={state}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <RatingCardBig index={index} item={item} />
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

    </SafeAreaView>
  );
};

export default comment;


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
      },
      model: {
        marginTop: 15,
        flex:1
      },






})