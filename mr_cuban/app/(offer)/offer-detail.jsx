import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { CancelOfferAPI } from "../../api/offer";
import RatingModal from "../../components/RatingModal";
import AudioCallModal from "../../components/AudioCallModal";
import { SendCallNotificationAPI } from "../../api/agora";
import img from "../../assets/img/taxi-app.gif";

const OfferDetail = () => {
  const params = useLocalSearchParams();
  const offerId = params?.id;
  const { user } = useSelector((state) => state.user);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [canCall, setCanCall] = useState(false);

  useEffect(() => {
    if (params?.offer) {
      try {
        const parsedOffer = JSON.parse(params.offer);
        setOffer(parsedOffer);
        console.log("Customer Offer Data:", parsedOffer);
        console.log("OTP:", parsedOffer?.otp);
        console.log("Ride Status:", parsedOffer?.rideStatus);
        console.log("Customer Order ID:", parsedOffer?.customerOrderId);

        // Check if calling is allowed (within 30 minutes of pickup time)
        checkCallAvailability(parsedOffer);
      } catch (error) {
        console.log("Error parsing offer:", error);
      }
    }
  }, [params?.offer]);

  // Check if call button should be enabled (within 30 mins before pickup)
  const checkCallAvailability = (offerData) => {
    if (!offerData?.pickupTimeStart || offerData?.rideStatus === "completed" || offerData?.rideStatus === "cancelled") {
      setCanCall(false);
      return;
    }

    const pickupTime = new Date(offerData.pickupTimeStart);
    const currentTime = new Date();
    const timeDiff = pickupTime - currentTime;
    const minutesUntilPickup = Math.floor(timeDiff / (1000 * 60));

    // Allow calling within 30 minutes before pickup time
    if (minutesUntilPickup <= 30 && minutesUntilPickup >= -60) {
      setCanCall(true);
    } else {
      setCanCall(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCall = async () => {
    if (!canCall) {
      ToastAndroid.show("Calling is available 30 mins before pickup time", ToastAndroid.LONG);
      return;
    }

    try {
      // Send call notification to driver
      const channelName = `offer_${offer?._id}`;
      await SendCallNotificationAPI(
        offer?.driverId?._id,
        user?.name || "Customer",
        channelName,
        user?._id // Pass customer ID as caller ID for rejection handling
      );

      // Open call modal
      setCallModalVisible(true);
    } catch (error) {
      console.log("Error sending call notification:", error);
      // Still open call modal even if notification fails
      setCallModalVisible(true);
    }
  };

  const handleCancelOffer = () => {
    if (offer?.rideStatus === "started") {
      ToastAndroid.show("Cannot cancel a started ride", ToastAndroid.SHORT);
      return;
    }
    if (offer?.rideStatus === "completed" || offer?.rideStatus === "cancelled") {
      ToastAndroid.show("Ride already completed or cancelled", ToastAndroid.SHORT);
      return;
    }

    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setCancelLoading(true);
              const result = await CancelOfferAPI(
                offer?.customerOrderId,
                offer?.driverOrderId
              );
              if (result?.data?.success) {
                ToastAndroid.show("Ride cancelled successfully", ToastAndroid.LONG);
                router.back();
              }
            } catch (error) {
              console.log(error);
            } finally {
              setCancelLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  if (!offer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Image
            source={img}
            resizeMode="contain"
            style={{ width: 300, height: 300 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Offer Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Driver Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          <View style={styles.driverCard}>
            <Ionicons name="person-circle" size={60} color={colors.primary} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.driverName}>{offer?.driverName}</Text>
              <View style={styles.driverDetails}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.detailText}>
                  {offer?.driverId?.rating || "0"} Rating
                </Text>
              </View>
              {offer?.driverPhone && (
                <View style={styles.driverDetails}>
                  <Ionicons name="call" size={16} color={colors.primary} />
                  <Text style={styles.detailText}>{offer?.driverPhone}</Text>
                </View>
              )}
              {/* OTP Display (only when accepted, not started yet) */}
              {(offer?.rideStatus === "accepted" || !offer?.rideStatus) && offer?.rideStatus !== "started" && offer?.otp && (
                <View style={styles.driverDetails}>
                  <Ionicons name="lock-closed" size={16} color={colors.primary} />
                  <Text style={styles.detailText}>OTP: </Text>
                  <View style={styles.otpInlineContainer}>
                    <Text style={styles.otpInlineDigit}>{String(offer.otp)[0]}</Text>
                    <Text style={styles.otpInlineDigit}>{String(offer.otp)[1]}</Text>
                    <Text style={styles.otpInlineDigit}>{String(offer.otp)[2]}</Text>
                    <Text style={styles.otpInlineDigit}>{String(offer.otp)[3]}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>

          <View style={styles.detailRow}>
            <MaterialIcons name="route" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.label}>Trip Type</Text>
              <Text style={styles.value}>{offer?.tripType}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <TouchableOpacity
              style={styles.locationRow}
              onPress={() => openGoogleMaps(offer?.pickupAddress)}
            >
              <Ionicons name="location" size={24} color={colors.primary} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.label}>Pickup Location</Text>
                <Text style={styles.value}>{offer?.pickupAddress}</Text>
              </View>
              <Ionicons name="navigate" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.locationDivider} />

            <TouchableOpacity
              style={styles.locationRow}
              onPress={() => openGoogleMaps(offer?.dropAddress)}
            >
              <Ionicons name="location" size={24} color="#f44336" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.label}>Drop Location</Text>
                <Text style={styles.value}>{offer?.dropAddress}</Text>
              </View>
              <Ionicons name="navigate" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.label}>Pickup Date & Time</Text>
              <Text style={styles.value}>{offer?.pickupDate}</Text>
              <Text style={styles.timeRange}>
                Between {formatTime(offer?.pickupTimeStart)} - {formatTime(offer?.pickupTimeEnd)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="straighten" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.value}>{offer?.distance} KM</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="airline-seat-recline-normal" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.label}>Seating</Text>
              <Text style={styles.value}>{offer?.seater || 4} Seater</Text>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Total Distance</Text>
            <Text style={styles.pricingValue}>{offer?.distance} KM</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Price per KM</Text>
            <Text style={styles.pricingValue}>
              ₹{(offer?.amount / offer?.distance).toFixed(2)}
            </Text>
          </View>
          <View style={styles.pricingDivider} />
          <View style={styles.pricingRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{offer?.amount}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {offer?.rideStatus === "completed" ? (
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.buttonText}>Give Feedback</Text>
          </TouchableOpacity>
        ) : offer?.rideStatus === "cancelled" ? (
          <View style={styles.cancelledButton}>
            <Text style={styles.buttonText}>Ride Cancelled</Text>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            {/* Call Button */}
            <TouchableOpacity
              style={[
                styles.callButton,
                !canCall && styles.buttonDisabled,
              ]}
              onPress={handleCall}
              disabled={!canCall}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.buttonText}>Call Driver</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={[
                styles.cancelButton,
                (cancelLoading || offer?.rideStatus === "started") && styles.buttonDisabled,
              ]}
              onPress={handleCancelOffer}
              disabled={cancelLoading || offer?.rideStatus === "started"}
            >
              {cancelLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="close-circle" size={20} color="#fff" />
                  <Text style={styles.buttonText}>
                    {offer?.rideStatus === "started" ? "Cannot Cancel" : "Cancel Ride"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Rating Modal */}
      <RatingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={{ driver: [{ _id: offer?.driverId?._id || offer?.driverId }] }}
        id={user?._id}
      />

      {/* Audio Call Modal */}
      <AudioCallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        driverName={offer?.driverName || "Driver"}
        channelName={`offer_${offer?._id}`}
      />

      <StatusBar backgroundColor="#000" style="light" />
    </SafeAreaView>
  );
};

export default OfferDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  statusBadge: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  driverDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  detailText: {
    color: "#ccc",
    marginLeft: 5,
    fontSize: 14,
  },
  otpSection: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  otpLabel: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  otpDigit: {
    backgroundColor: colors.primary,
    color: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: "bold",
  },
  otpInlineContainer: {
    flexDirection: "row",
    gap: 3,
    marginLeft: 5,
  },
  otpInlineDigit: {
    backgroundColor: colors.primary,
    color: "#fff",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 14,
    fontWeight: "bold",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  label: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  timeRange: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  locationDivider: {
    height: 20,
    width: 2,
    backgroundColor: "#444",
    marginLeft: 12,
    marginVertical: 8,
  },
  pricingSection: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pricingLabel: {
    color: "#999",
    fontSize: 14,
  },
  pricingValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pricingDivider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },
  totalLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  feedbackButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  callButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f44336",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  cancelledButton: {
    backgroundColor: "#666",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
