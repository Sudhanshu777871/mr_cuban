import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Button,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import img from "../../assets/img/login.jpg";
import { BlurView } from "expo-blur";
import img2 from "../../assets/img/car3.png";
import star from "../../assets/img/star.png";
import { colors } from "../../assets/color";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  CancelOrderAPI,
  GetRidesAPI,
  SearchOrders,
  CustomerNegotiationAPIGlobal,
} from "../../api/order";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import AuthButton from "../../components/AuthButton";
import img3 from "../../assets/img/taxi_loader.gif";
import { Modal, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Linking } from "react-native";

const search = () => {
  const { isOrder } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.user);
  const [negotitateLoding, setNegotiateLoading] = useState(false);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [state, setState] = useState();
  console.log("In the state the order id is : " , state?._id)
  const [rides, setRides] = useState([]);
  const [rideLoading, setRideLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [negotiationPrice, setNegotiationPrice] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    drop: "",
    tripType: "one-way",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  // Custom rounding function for per-km price
  const roundPerKmPrice = (price) => {
    const integerPart = Math.floor(price);
    const decimalPart = price - integerPart;

    // If already a whole number (no decimal part), return as is
    if (decimalPart === 0 || decimalPart < 0.01) {
      return price;
    }

    if (decimalPart < 0.50) {
      // If decimal is less than 0.50, round to .50
      return integerPart + 0.50;
    } else {
      // If decimal is 0.50 or more, round up to next whole number
      return Math.ceil(price);
    }
  };

  // code for pickupdate and pickuptime in request a ride modal
  const [pickupDate, setPickupDate] = useState(() => {
    if (state?.pickup_date) {
      const [datePart] = state.pickup_date.split(",");
      return new Date(datePart.trim());
    }
    return new Date();
  });

  const [pickupTime, setPickupTime] = useState(() => {
    if (state?.pickup_date) {
      const [datePart, timePart] = state.pickup_date.split(",");
      const base = new Date(`${datePart.trim()} ${timePart.trim()}`);
      base.setHours(base.getHours() + 3); // +3 hours from user-selected time
      return base;
    }
    const now = new Date();
    now.setHours(now.getHours() + 3);
    return now;
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleNegotiate = async() => {
    if (!negotiationPrice || negotiationPrice.trim() === "") {
      ToastAndroid.show("Please enter negotiation price!", ToastAndroid.SHORT);
      return;
      
}
else {
          try {
            setNegotiateLoading(true);
            const result = await CustomerNegotiationAPIGlobal(
              negotiationPrice,
              state?._id
            );
    console.log("The Resule in Negotiation Global Is : " , result)
            if (result?.data?.data) {
              ToastAndroid.show("Your Negotitation Request Sent", ToastAndroid.SHORT);
            }
          } catch (error) {
            console.log(error);
          } finally {
            setNegotiateLoading(false);
          }      
        }
  };

  const SearchRides = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const result = await SearchOrders(user?._id, token);
      if (result?.data?.data) {
        setState(result?.data?.data);
        setRides(result?.data?.data?.drivers);
      } else {
        setState([]);
        setRides([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const CancelOrder = async () => {
    try {
      setLoading2(true);
      const id = await AsyncStorage.getItem("orderId");
      const result = await CancelOrderAPI(id);
      if (result?.data?.data) {
        // Clear the orderId from AsyncStorage
        await AsyncStorage.removeItem("orderId");
        dispatch({ type: "deleteOrder", payload: false });
        ToastAndroid.show("Ride Cancel successfully 🚗", ToastAndroid.SHORT);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const handleBackAction = () => {
    if (isOrder) {
      Alert.alert(
        "Cancel Order",
        "You must cancel your order before leaving the screen.",
        [
          {
            text: "Cancel",
            onPress: () => CancelOrder(),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {},
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
      return true;
    }
    return false;
  };

  const validateForm = () => {
    const { name, phone, pickup, drop } = form;
    if (!name || !phone || !pickup || !drop) {
      ToastAndroid.show("Please fill all fields!", ToastAndroid.SHORT);
      return false;
    }
    return true;
  };

  const sendRideRequest = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const message = `
  🚗 *New Ride Request*
  -----------------------------
  👤 Name: ${form.name}
  📞 Phone: ${form.phone}
  📍 Pickup: ${form.pickup}
  🏁 Drop: ${form.drop}
  📅 Date: ${pickupDate.toDateString()}
  ⏰ Time: ${pickupTime.toLocaleTimeString()}
  🔁 Trip Type: ${form.tripType}
  `;

      const phoneNumber = "917395050838";
      const url =
        "whatsapp://send?phone=" +
        phoneNumber +
        "&text=" +
        encodeURIComponent(message);

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        ToastAndroid.show("Opening WhatsApp...", ToastAndroid.SHORT);
        setModalVisible(false);
      } else {
        // WhatsApp not installed → fallback to web
        const webUrl =
          "https://wa.me/" +
          phoneNumber +
          "?text=" +
          encodeURIComponent(message);

        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.log("WhatsApp error:", error);
      ToastAndroid.show("Failed to open WhatsApp!", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add the event listener for the back button press on Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    );

    // Cleanup the listener when the component unmounts
    return () => backHandler.remove();
  }, [isOrder]);

  const fetchRides = async () => {
    try {
      setRideLoading(true);
      const result = await GetRidesAPI(state?._id);

      if (result?.data?.data) {
        setRides(result?.data?.data?.drivers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRideLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    if (isOrder && state?._id) {
      intervalId = setInterval(() => {
        fetchRides();
      }, 10000);
    }

    // Cleanup interval on unmount or when isOrder changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOrder, state?._id]);

  useEffect(() => {
    if (isOrder) {
      SearchRides();
    }
  }, [isOrder]);

  useEffect(() => {
    if (state) {
      setForm((prev) => ({
        ...prev,
        pickup: state?.pickup_address || "",
        drop: state?.drop_address || "",
        name: user?.name || "",
        phone: user?.phone || "",
      }));
    }
  }, [state]);

  useEffect(() => {
    // Reset button state when order starts
    if (!isOrder) {
      setShowRequestButton(false);
      return;
    }

    // Start timer only once when isOrder becomes true
    const timer = setTimeout(() => {
      // After 30 seconds, check if rides are still empty
      if (rides?.length === 0) {
        setShowRequestButton(true);
      }
    }, 30000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [isOrder]); // Only run when isOrder changes

  // Hide button immediately when rides appear
  useEffect(() => {
    if (rides?.length > 0) {
      setShowRequestButton(false);
    }
  }, [rides]);
  return (
    <ImageBackground
      source={img}
      style={{ flex: 1, justifyContent: "center" }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        {loading ? (
          <View style={styles.loader}>
            <Text style={{ color: colors.primary, fontSize: 30 }}>
              MR <Text style={{ color: colors.green }}>Cuban</Text>
            </Text>
            <Text>
              <ActivityIndicator color={"#fff"} size={"large"} />
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={styles.topWrap}>
              <View style={styles.top}>
                {/* Negotiation Section */}
                {rides?.length > 0 && (
                  <View style={styles.negotiationContainer}>
                    <TextInput
                      style={styles.negotiationInput}
                      placeholder="Enter price (₹)"
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={negotiationPrice}
                      onChangeText={setNegotiationPrice}
                    />
                    <TouchableOpacity
                      style={styles.negotiateButton}
                      onPress={handleNegotiate}
                    >
                      {negotitateLoding ? (
                        <ActivityIndicator size="small" color={"white"} />
                      ) : (
                        <>
                          <Text style={styles.negotiateButtonText}>
                            Negotiate
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.line}>
                  <View style={styles.circle}></View>
                  <View style={styles.wrap}>
                    <Text style={styles.sm}>Pickup Location</Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.p}
                    >
                      {state?.pickup_address}
                    </Text>
                  </View>
                </View>
                <View style={styles.line}>
                  <View style={styles.circle}></View>
                  <View style={styles.wrap}>
                    <Text style={styles.sm}>Drop Location</Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.p}
                    >
                      {" "}
                      {state?.drop_address}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => setMore(!more)}>
                  <Text style={styles.more}>
                    {more ? (
                      <Text>
                        Less Details
                        <AntDesign name="down" size={12} color="white" />
                      </Text>
                    ) : (
                      <Text>
                        More Details{" "}
                        <AntDesign name="up" size={12} color="white" />
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>

                {more && (
                  <>
                    <View style={styles.line}>
                      <View style={styles.circle}></View>
                      <View style={styles.wrap}>
                        <Text style={styles.sm}>Pickup Date & Time</Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.p}
                        >
                          {state?.pickup_date?.split(",")[0]}{" "}
                          {state?.pickup_date?.split(",")[1]}
                        </Text>
                      </View>
                    </View>
                    {state?.trip_type === "Round Trip" && (
                      <>
                        <View style={styles.line}>
                          <View style={styles.circle}></View>
                          <View style={styles.wrap}>
                            <Text style={styles.sm}>Return Pickup Address</Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={styles.p}
                            >
                              {" "}
                              {state?.return_pickup_address}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.line}>
                          <View style={styles.circle}></View>
                          <View style={styles.wrap}>
                            <Text style={styles.sm}>Return Drop Address</Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={styles.p}
                            >
                              {" "}
                              {state?.return_drop_address}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.line}>
                          <View style={styles.circle}></View>
                          <View style={styles.wrap}>
                            <Text style={styles.sm}>Return Date & Time</Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={styles.p}
                            >
                              {state?.return_date?.split(",")[0]}{" "}
                              {state?.return_date?.split(",")[1]}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
            </View>

            <View style={{ width: "100%", padding: 20, paddingBottom: 10 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 600,
                  fontFamily: "regular",
                }}
              >
                List of Rides{" "}
                <Text style={{ color: colors.primary, fontSize: 20 }}></Text>
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 400,
                  fontFamily: "regular",
                  marginTop: 10,
                }}
              >
                Select your ride and negotiate with the driver for the best
                fare.
              </Text>
              {showRequestButton && (
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => setModalVisible(true)}
                >
                  <MaterialIcons name="directions-car" size={22} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.flat}>
              {rides?.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.loader2}>
                    <Image
                      resizeMode="contain"
                      style={{ width: "100%", height: "100%" }}
                      source={img3}
                    />
                  </View>
                </View>
              ) : (
                <FlatList
                  data={[...rides].reverse()}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item?.id}-${index}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/detail",
                          params: {
                            name: item?.name,
                            rating: item?.rating,
                            order: item?.orders,
                            price: item?.price,
                            pickup: state?.pickup_address,
                            drop: state?.drop_address,
                            way: state?.trip_type,
                            returnPickup: state?.return_pickup_address,
                            returnDrop: state?.return_drop_address,
                            dropDate: state?.return_date,
                            pickupDate: state?.pickup_date,
                            modelName: item?.model?.model,
                            modelNumber: item?.model?.modelNumber,
                            order_id: state?._id,
                            driver_id: item?.id,
                            image: JSON.stringify(item?.model?.modelImage),
                            km: state?.distance,
                          },
                        })
                      }
                    >
                      <BlurView
                        intensity={70}
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
                        key={item?.id}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 20,
                          }}
                        >
                          <View style={styles.left}>
                            <Image
                              resizeMode="contain"
                              style={{ width: 100 }}
                              source={img2}
                            />
                            <View
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: 10,
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {item.rating}{" "}
                                <Image
                                  source={star}
                                  resizeMode="contain"
                                  style={{ width: 15, height: 15 }}
                                />{" "}
                              </Text>
                              <Text
                                style={{
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {item.orders}{" "}
                                <Text style={{ color: colors.green }}>
                                  Orders
                                </Text>
                              </Text>
                            </View>
                          </View>
                          <View style={styles.right}>
                            <Text style={styles.h2}>{item.name}</Text>
                            <Text style={styles.p4}>
                              <Text>
                                Model Name:{" "}
                                <Text style={{ color: "white" }}>
                                  {item.model?.model}
                                </Text>
                              </Text>
                            </Text>
                            <Text style={styles.p3}>
                              ₹{item.price}{" "}
                              <Text style={styles.perKmText}>
                                (₹{roundPerKmPrice(
                                  item.price /
                                  (state?.trip_type === "Round Trip" ? state?.distance * 2 : state?.distance)
                                ).toFixed(2)}/km)
                              </Text>
                            </Text>
                          </View>
                        </View>
                        <View style={styles.inputset}>
                          <View style={styles.pin}>
                            <FontAwesome
                              name="map-pin"
                              size={24}
                              color="white"
                            />
                          </View>
                          <View style={styles.line2}></View>
                          <Text style={styles.ov}>{state?.trip_type}</Text>
                          <View style={styles.line2}></View>
                          <View style={styles.pin}>
                            <FontAwesome5
                              name="map-marker-alt"
                              size={24}
                              color="white"
                            />
                          </View>
                        </View>
                      </BlurView>
                    </TouchableOpacity>
                  )}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                />
              )}

              {rides?.length > 0 && (
                <AuthButton
                  title={"Cancel Ride"}
                  loading={loading2}
                  handlePress={CancelOrder}
                />
              )}
            </View>
          </View>
        )}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Request a Ride</Text>

              <TextInput
                placeholder="Pickup Address"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={form.pickup}
                onChangeText={(text) => setForm({ ...form, pickup: text })}
              />
              <TextInput
                placeholder="Drop Address"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={form.drop}
                onChangeText={(text) => setForm({ ...form, drop: text })}
              />

              <View style={styles.dateTimeRow}>
                {/* Pickup Date */}
                <TouchableOpacity
                  style={[styles.input, { flex: 1, marginRight: 5 }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: "#fff" }}>
                    {pickupDate.toDateString()}
                  </Text>
                </TouchableOpacity>

                {/* Pickup Time */}
                <TouchableOpacity
                  style={[styles.input, { flex: 1, marginLeft: 5 }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={{ color: "#fff" }}>
                    {pickupTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Radio buttons for trip type */}
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setForm({ ...form, tripType: "one-way" })}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      form.tripType === "one-way" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioText}>One Way</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setForm({ ...form, tripType: "two-way" })}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      form.tripType === "two-way" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioText}>Two Way</Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setPickupDate(selectedDate);
                  }}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={pickupTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      const now = new Date();
                      now.setHours(now.getHours() + 3);

                      // also enforce 3 hours after user's original selected time
                      const [datePart, timePart] =
                        state?.pickup_date?.split(",") || [];
                      const baseUserTime = new Date(
                        `${datePart?.trim()} ${timePart?.trim()}`
                      );
                      const minAllowed = new Date(
                        Math.max(
                          now,
                          baseUserTime.getTime() + 3 * 60 * 60 * 1000
                        )
                      );

                      // Compare
                      const newTime = new Date(
                        pickupDate.getFullYear(),
                        pickupDate.getMonth(),
                        pickupDate.getDate(),
                        selectedTime.getHours(),
                        selectedTime.getMinutes()
                      );

                      if (newTime < minAllowed) {
                        ToastAndroid.show(
                          "Pickup time must be at least 3 hours after selected time!",
                          ToastAndroid.SHORT
                        );
                        setPickupTime(minAllowed);
                      } else {
                        setPickupTime(newTime);
                      }
                    }
                  }}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "gray" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                  onPress={sendRideRequest}
                >
                  <Text style={styles.modalBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default search;

const styles = StyleSheet.create({
  negotiationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    gap: 10,
  },
  negotiationInput: {
    flex: 1,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  negotiateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  negotiateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    gap: 8,
    marginBottom: 10,
    width: 50,
    position: "absolute",
    zIndex: 5,
    right: 0,
    top: 500,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#fff",
  },
  radioSelected: {
    backgroundColor: colors.primary,
  },
  radioText: {
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  topWrap: {
    width: "100%",
    padding: 10,
  },
  top: {
    width: "100%",
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 10,
    height: "fit-content",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
  },
  circle: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 50,
    marginTop: 3,
  },

  line: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    width: "100%",
    overflow: "hidden",
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
    fontSize: 18,
    fontFamily: "bold",
    fontWeight: "bold",
    marginBottom: 2,
  },
  p3: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "bold",
    fontWeight: "bold",
  },
  perKmText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  p4: {
    color: colors.green,
    fontSize: 12,
    fontFamily: "bold",
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputset: {
    flexDirection: "row", // Align elements in a row
    alignItems: "center", // Align elements vertically center
    justifyContent: "space-between", // Space them evenly
    paddingHorizontal: 10,
  },
  pin: {
    color: colors.primary,
  },
  ov: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    color: colors.primary,
  },
  line2: {
    flex: 1, // Takes up available space between the labels
    borderBottomWidth: 1,
    borderColor: "#fff", // Line color
    borderStyle: "dashed",
    marginHorizontal: 10,
  },

  more: {
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loader: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
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
  loader2: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
