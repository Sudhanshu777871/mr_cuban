import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { FinishOfferRideAPI, CancelUnacceptedOfferAPI } from "../../api/offer";
import AudioCallModal from "../../components/AudioCallModal";
import { SendCallNotificationAPI } from "../../api/agora";
import img from "../../assets/img/taxi-app.gif";

const OfferDetail = () => {
  const params = useLocalSearchParams();
  const offerId = params?.id;
  const driver = useSelector((state) => state.user.user);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [canCall, setCanCall] = useState(false);

  useEffect(() => {
    if (params?.offer) {
      try {
        const parsedOffer = JSON.parse(params.offer);
        setOffer(parsedOffer);
        console.log("Offer Data:", parsedOffer);
        console.log("Offer ID:", parsedOffer?._id);
        console.log("Offer Status:", parsedOffer?.status);
        console.log("Driver Order ID:", parsedOffer?.driverOrderId);
        console.log("OTP:", parsedOffer?.otp);
        console.log("Customer ID field:", parsedOffer?.customerId);
        console.log("Customer field:", parsedOffer?.customer);

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

  const handleStartRide = () => {
    router.push({
      pathname: "/(offer)/start-offer-ride",
      params: {
        driverOrderId: offer?.driverOrderId,
        offer: JSON.stringify(offer),
      },
    });
  };

  const handleCall = async () => {
    if (!canCall) {
      ToastAndroid.show("Calling is available 30 mins before pickup time", ToastAndroid.LONG);
      return;
    }

    try {
      // Get customer ID - check different possible fields
      const customerId = offer?.customerId?._id || offer?.customerId || offer?.customer?._id || offer?.customer;

      console.log("Offer data for call:", {
        offerId: offer?._id,
        customerId: customerId,
        customerIdObj: offer?.customerId,
        customerObj: offer?.customer,
        driverName: driver?.name
      });

      // Send call notification to customer
      const channelName = `offer_${offer?._id}`;
      await SendCallNotificationAPI(
        customerId,
        driver?.name || "Driver",
        channelName,
        driver?._id // Pass driver ID as caller ID for rejection handling
      );

      // Open call modal
      setCallModalVisible(true);
    } catch (error) {
      console.log("Error sending call notification:", error);
      // Still open call modal even if notification fails
      setCallModalVisible(true);
    }
  };

  const handleFinishRide = async () => {
    Alert.alert(
      "Confirm Ride Completion",
      "Are you sure you want to complete this ride? The payment has been successfully received from the customer. This action is irreversible.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete Ride",
          onPress: async () => {
            try {
              setLoading(true);
              const result = await FinishOfferRideAPI(offer?.driverOrderId);
              if (result?.data?.success) {
                ToastAndroid.show("Ride Completed Successfully", ToastAndroid.LONG);
                router.back();
              }
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCancelOffer = async () => {
    // Validate offer ID exists
    const offerIdToCancel = offer?._id || offerId;
    if (!offerIdToCancel) {
      ToastAndroid.show("Error: Offer ID not found", ToastAndroid.SHORT);
      console.log("Cancel Error: No offer ID available", { offer, offerId });
      return;
    }

    Alert.alert(
      "Cancel Offer",
      "Are you sure you want to cancel this offer? This action cannot be undone.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              console.log("Canceling offer with ID:", offerIdToCancel);
              const result = await CancelUnacceptedOfferAPI(offerIdToCancel);
              if (result?.data?.success) {
                ToastAndroid.show("Offer cancelled successfully", ToastAndroid.LONG);
                router.back();
              }
            } catch (error) {
              console.log("Cancel offer error:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${encodeURIComponent(address)}`;
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
          <Text style={styles.headerTitle}>Offer Ride Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Customer Information */}
        {offer?.acceptedBy && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.customerCard}>
              <Ionicons name="person-circle" size={60} color={colors.primary} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={styles.customerName}>
                  {offer?.acceptedBy?.customerName}
                </Text>
                <Text style={styles.detailText}>
                  Accepted on:{" "}
                  {new Date(offer?.acceptedBy?.acceptedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}

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
              <Feather name="map-pin" size={24} color={colors.primary} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.label}>Pickup Location</Text>
                <Text style={styles.value}>{offer?.pickupAddress}</Text>
              </View>
              <Ionicons name="navigate" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.locationDivider} />

            <TouchableOpacity
              style={styles.locationRow}
              onPress={() => openGoogleMaps(offer?.dropAddress)}
            >
              <Feather name="map-pin" size={24} color="#f44336" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.label}>Drop Location</Text>
                <Text style={styles.value}>{offer?.dropAddress}</Text>
              </View>
              <Ionicons name="navigate" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.label}>Pickup Date & Time</Text>
              <Text style={styles.value}>{offer?.pickupDate}</Text>
              <Text style={styles.timeRange}>
                Between {formatTime(offer?.pickupTimeStart)} -{" "}
                {formatTime(offer?.pickupTimeEnd)}
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
            <MaterialIcons
              name="airline-seat-recline-normal"
              size={20}
              color={colors.primary}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.label}>Seating</Text>
              <Text style={styles.value}>{offer?.seat || 4} Seater</Text>
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
      {/* Show cancel button for active (not accepted) offers */}
      {offer?.status === "active" && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, loading && styles.buttonDisabled]}
            onPress={handleCancelOffer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="close-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cancel Offer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Show ride control buttons for accepted offers */}
      {offer?.status === "accepted" && offer?.rideStatus !== "completed" && offer?.rideStatus !== "cancelled" && (
        <View style={styles.actionContainer}>
          {(offer?.rideStatus === "accepted" || !offer?.rideStatus) ? (
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
                <Text style={styles.buttonText}>Call Customer</Text>
              </TouchableOpacity>

              {/* Start Ride Button */}
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartRide}
              >
                <Ionicons name="play-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Start Ride</Text>
              </TouchableOpacity>
            </View>
          ) : offer?.rideStatus === "started" ? (
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
                <Text style={styles.buttonText}>Call Customer</Text>
              </TouchableOpacity>

              {/* Finish Ride Button */}
              <TouchableOpacity
                style={[styles.finishButton, loading && styles.buttonDisabled]}
                onPress={handleFinishRide}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Finish Ride</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}

      {/* Audio Call Modal */}
      <AudioCallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        customerName={offer?.acceptedBy?.customerName || "Customer"}
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
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  detailText: {
    color: "#ccc",
    fontSize: 14,
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
  startButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  finishButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "#f44336",
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
