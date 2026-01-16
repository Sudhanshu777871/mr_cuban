import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import img from "../../assets/img/login.jpg";
import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AuthButton from "../../components/AuthButton";
import { router, useLocalSearchParams } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useDispatch, useSelector } from "react-redux";
import { AcceptOrderAPI, CustomerNegotiationAPI } from "../../api/order";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const detail = () => {
  const {
    name,
    rating,
    order,
    price,
    pickup,
    drop,
    way,
    returnPickup,
    returnDrop,
    dropDate,
    pickupDate,
    modelName,
    modelNumber,
    order_id,
    driver_id,
    image,
    km,
  } = useLocalSearchParams();

  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [negotitateLoding, setNegotiateLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [negotiateAmount, setNegotiateAmount] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);

  const dispatch = useDispatch();

  const CreateOrder = async () => {
    try {
      setLoading(true);
      const result = await AcceptOrderAPI(
        order_id,
        driver_id,
        user?._id,
        user?._name,
        price
      );

      if (result?.data?.data) {
        ToastAndroid.show(
          "Your ride has been successfully booked. Thank you for choosing Mr. Cuban for your travel needs.",
          ToastAndroid.SHORT
        );
        // Clear the orderId from AsyncStorage when ride is accepted
        await AsyncStorage.removeItem("orderId");
        dispatch({ type: "deleteOrder", payload: false });
        router.replace("/history");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handelNegotiate = async () => {
    if (!negotiateAmount) {
      ToastAndroid.show("Please Enter Negotiation Amount", ToastAndroid.SHORT);
      return;
    }

    // Validate amount - must be at least 3 digits
    if (negotiateAmount.length < 3) {
      setShowValidationModal(true);
      return;
    }

    try {
      setNegotiateLoading(true);
      const result = await CustomerNegotiationAPI(
        order_id,
        driver_id,
        negotiateAmount
      );

      if (result?.data?.data) {
        ToastAndroid.show("Your Negotiation Request Sent", ToastAndroid.SHORT);
        router.replace("/search");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setNegotiateLoading(false);
    }
  };

  console.log(JSON.parse(image));

  useEffect(() => {
    if (image) {
      setImages(JSON.parse(image));
    }
  }, [image]);

  return (
    <ImageBackground
      source={img}
      style={{ flex: 1, justifyContent: "center" }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={styles.back}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back-circle"
              size={34}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.door}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          >
            <View style={styles.wrap}>
              <Text style={styles.text}>Confirmation Order</Text>
              <View style={styles.otp}>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[0]}
                </Text>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[1]}
                </Text>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[2]}
                </Text>
                <Text style={styles.otptext}>
                  {String(user?.accountOtp)[3]}
                </Text>
              </View>
            </View>
            <View style={styles.profile}>
              <View style={styles.icon}>
                <Text style={{ color: "#fff", fontWeight: 600, fontSize: 20 }}>
                  {name[0]}
                </Text>
              </View>
              <View style={styles.content}>
                <Text style={{ color: "#fff", fontWeight: 600, fontSize: 20 }}>
                  {name}
                </Text>
                <View style={styles.rate}>
                  <Text style={styles.star}>
                    <Fontisto name="star" size={12} color={colors.primary} />{" "}
                    {rating}+
                  </Text>
                  <Text style={styles.order}>{order} Orders</Text>
                </View>
              </View>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Model Name</Text>
              <Text style={styles.text1}>{modelName}</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Model Number</Text>
              <Text style={styles.text1}>{modelNumber}</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Round Trip</Text>
              <Text style={styles.text1}>
                {way === "Round Trip" ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Total Price</Text>
              <Text style={styles.text1}>₹{price}</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Pickup Location</Text>
              <Text style={styles.text1}>{pickup}</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Drop Location</Text>
              <Text style={styles.text1}>{drop}</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Pickup Time</Text>
              <Text style={styles.text2}>{pickupDate}</Text>
            </View>
            {way === "Round Trip" && (
              <>
                <View style={styles.form}>
                  <Text style={styles.label}>Return Pickup Location</Text>
                  <Text style={styles.text1}>{returnPickup}</Text>
                </View>

                <View style={styles.form}>
                  <Text style={styles.label}>Return Drop Location</Text>
                  <Text style={styles.text1}>{returnDrop}</Text>
                </View>

                <View style={styles.form}>
                  <Text style={styles.label}>Return Time</Text>
                  <Text style={styles.text2}>{dropDate}</Text>
                </View>
              </>
            )}
            <View style={styles.form}>
              <Text style={styles.label}>
                {way === "Round Trip" ? "Total Distance (Round Trip)" : "One Way Distance (Aprox)"}
              </Text>
              <Text style={styles.text1}>
                {way === "Round Trip" ? parseFloat(km) * 2 : km} KM
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Ride Per Kilometer</Text>
              <Text style={styles.text1}>
                ₹{(parseFloat(price) / (way === "Round Trip" ? parseFloat(km) * 2 : parseFloat(km))).toFixed(2)}
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Car Images</Text>
              <View style={styles.images}>
                {images?.map((s) => (
                  <Image
                    resizeMode="cover"
                    source={{ uri: s?.url }}
                    key={s?.public_id}
                    style={styles.img}
                  />
                ))}
              </View>
            </View>
            <View style={styles.list}>
              <Text style={styles.list_head}>Additional Charges:</Text>
              {/* <View style={styles.item}>
                <Text style={styles.title}>
                  Toll Costs, Parking, Permits, and State Taxes:
                </Text>
                <Text style={styles.description}>
                  Excluded from the ride fare.
                </Text>
              </View> */}
              <View style={styles.item}>
                <Text style={styles.title}>Extra Hours:</Text>
                <Text style={styles.description}>
                  ₹100 per hour for additional hours beyond the booking period.
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>Extra Kilometers:</Text>
                <Text style={styles.description}>
                  ₹10 per kilometer for distance exceeding the booked limit.
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>Night Allowance:</Text>
                <Text style={styles.description}>
                  ₹500 per night for rides between 11:00 PM and 6:00 AM.
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>Additional Fare:</Text>
                <Text style={styles.description}>
                  May apply if the trip does not end within the designated
                  region (Rest of India).
                </Text>
              </View>
            </View>

            {/* Negotiate Section */}
            <View style={styles.negotiateRow}>
              <TextInput
                placeholder="Enter your amount"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                style={styles.negotiateInput}
                value={negotiateAmount}
                onChangeText={(text) => setNegotiateAmount(text)}
              />

              <TouchableOpacity
                style={styles.negotiateBtn}
                onPress={handelNegotiate}
              >
                {negotitateLoding ? (
                  <ActivityIndicator size="small" color={"white"} />
                ) : (
                  <>
                    <Ionicons name="cash-outline" size={18} color="#fff" />
                    <Text style={styles.negotiateBtnText}>Negotiate</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Show negotiated price per km when amount is entered */}
            {negotiateAmount && negotiateAmount.length >= 3 && (
              <View style={styles.negotiatedPriceCard}>
                <View style={styles.negotiatedPriceRow}>
                  <Text style={styles.negotiatedLabel}>Your Offer:</Text>
                  <Text style={styles.negotiatedValue}>₹{negotiateAmount}</Text>
                </View>
                <View style={styles.negotiatedPriceRow}>
                  <Text style={styles.negotiatedLabel}>Price Per KM:</Text>
                  <Text style={styles.negotiatedValue}>
                    ₹{(parseFloat(negotiateAmount) / (way === "Round Trip" ? parseFloat(km) * 2 : parseFloat(km))).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.negotiatedPriceRow}>
                  <Text style={styles.negotiatedSavings}>
                    {parseFloat(negotiateAmount) < parseFloat(price) ?
                      `You save: ₹${(parseFloat(price) - parseFloat(negotiateAmount))}` :
                      `₹${(parseFloat(negotiateAmount) - parseFloat(price))} more than original price`
                    }
                  </Text>
                </View>
              </View>
            )}

            <AuthButton 
            buttonStyle={{ backgroundColor: "green" }}
              title={"Confirm Order"}
              loading={loading}
              handlePress={CreateOrder}
            />
            <Text
              style={{
                fontSize: 14,
                marginTop: 10,
                color: "#ccc",
                textAlign: "justify",
                lineHeight: 20,
                marginBottom: 20,
              }}
            >
              Your ride is confirmed! Please share this OTP with the driver when
              they arrive to begin your ride: {user?.accountOtp}. For your
              safety, do not share the OTP until the driver is with you.
            </Text>
          </ScrollView>
        </View>

        {/* Validation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showValidationModal}
          onRequestClose={() => setShowValidationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="alert-circle" size={50} color={colors.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.modalTitle}>Invalid Amount</Text>
              <Text style={styles.modalMessage}>
                Please enter complete ride amount.{'\n'}
                Amount should be at least ₹100
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowValidationModal(false);
                  setNegotiateAmount("");
                }}
              >
                <Text style={styles.modalButtonText}>OK, Got It</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <StatusBar backgroundColor="#000" style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default detail;

const styles = StyleSheet.create({
  door: {
    width: "100%",
    display: "flex",
    backgroundColor: "rgba(0,0,0,0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    bottom: 0,
    height: "90%",
    top: "10%",
  },
  wrap: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 15,
  },
  otp: {
    display: "flex",
    width: 100,
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  otptext: {
    backgroundColor: colors.primary,
    color: "#fff",
    borderRadius: 5,
    paddingVertical: 10, // Equivalent to 1rem
    paddingHorizontal: 16,
  },
  profile: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 50,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: 5,
  },
  rate: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  star: {
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    color: "#fff",
  },
  order: {
    color: "#fff",
    fontSize: 16,
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginBottom: 10,
  },
  label: {
    color: "#ccc",
    fontSize: 14,
  },
  text1: {
    color: "#fff",
    fontSize: 16,
    textTransform: "capitalize",
  },
  text2: {
    color: "#fff",
    fontSize: 16,
    textTransform: "uppercase",
  },
  back: {
    color: "#fff",
    marginTop: 20,
    marginLeft: 20,
  },
  images: {
    width: "100%",
    display: "flex",
    gap: 10,
    flexDirection: "row",
    marginTop: 10,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  list: {
    marginTop: 10,
  },
  list_head: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: 10,
  },
  title: {
    color: colors.primary,
    fontSize: 14,
  },
  description: {
    color: "#fff",
    fontSize: 13,
    marginTop: 3,
  },
  negotiateRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 15,
  },

  negotiateInput: {
    flex: 1,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },

  negotiateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },

  negotiateBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Negotiated price card styles
  negotiatedPriceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  negotiatedPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  negotiatedLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  negotiatedValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  negotiatedSavings: {
    color: '#4ade80',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 150,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
