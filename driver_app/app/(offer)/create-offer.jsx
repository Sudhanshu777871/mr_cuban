import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CreateOfferAPI } from "../../api/offer";

const PLATFORM_FEE = 400; // Platform fee in INR

const CreateOffer = () => {
  const router = useRouter();
  const driver = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Check if driver data is available
  if (!driver || !driver._id) {
    ToastAndroid.show("Please login first", ToastAndroid.SHORT);
    router.back();
    return null;
  }
  
  // Form state
  const [tripType, setTripType] = useState("One Way");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [amount, setAmount] = useState("");
  
  // Time range state
  const [pickupTimeStart, setPickupTimeStart] = useState(new Date());
  const [pickupTimeEnd, setPickupTimeEnd] = useState(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 3); // Default 3-hour range
    return endTime;
  });
  
  // Date/Time Picker state
  const [currentPickerTarget, setCurrentPickerTarget] = useState(null); // 'start' or 'end'
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateHoursDifference = (start, end) => {
    const diffMs = end - start;
    return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
  };

  const handleStartTimePress = () => {
    setCurrentPickerTarget('start');
    setShowDatePicker(true);
  };

  const handleEndTimePress = () => {
    setCurrentPickerTarget('end');
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    
    if (selectedDate && currentPickerTarget) {
      if (currentPickerTarget === 'start') {
        const newDate = new Date(pickupTimeStart);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        setPickupTimeStart(newDate);
      } else {
        const newDate = new Date(pickupTimeEnd);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        setPickupTimeEnd(newDate);
      }
      // Show time picker after date selection
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    
    if (selectedTime && currentPickerTarget) {
      if (currentPickerTarget === 'start') {
        const newDate = new Date(pickupTimeStart);
        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());
        setPickupTimeStart(newDate);
        
        // Auto-adjust end time if it's before new start time
        if (newDate >= pickupTimeEnd) {
          const newEndTime = new Date(newDate);
          newEndTime.setHours(newEndTime.getHours() + 3);
          setPickupTimeEnd(newEndTime);
        }
      } else {
        const newDate = new Date(pickupTimeEnd);
        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());
        setPickupTimeEnd(newDate);
      }
    }
    setCurrentPickerTarget(null);
  };

  const handleCreateOffer = async () => {
    // Validation
    if (!pickupAddress.trim()) {
      ToastAndroid.show("Please enter pickup address", ToastAndroid.SHORT);
      return;
    }
    if (!dropAddress.trim()) {
      ToastAndroid.show("Please enter drop address", ToastAndroid.SHORT);
      return;
    }
    if (!distance || parseFloat(distance) <= 0) {
      ToastAndroid.show("Please enter valid distance", ToastAndroid.SHORT);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      ToastAndroid.show("Please enter valid amount", ToastAndroid.SHORT);
      return;
    }

    // Check time range
    const hoursDiff = calculateHoursDifference(pickupTimeStart, pickupTimeEnd);
    if (hoursDiff < 3) {
      setShowValidationModal(true);
      return;
    }

    // Create offer
    try {
      setLoading(true);
      const offerData = {
        driverId: driver._id,
        driverName: driver.name,
        tripType,
        pickupAddress,
        dropAddress,
        distance: parseFloat(distance),
        amount: parseFloat(amount) + PLATFORM_FEE, // Add platform fee to the amount
        pickupTimeStart: pickupTimeStart.toISOString(),
        pickupTimeEnd: pickupTimeEnd.toISOString(),
      };

      const result = await CreateOfferAPI(offerData);
      if (result?.data?.success) {
        ToastAndroid.show("Offer created successfully!", ToastAndroid.LONG);
        router.push("/(tabs)/offers");
      }
    } catch (error) {
      console.log(error);
      // Error toast is already shown in CreateOfferAPI
    } finally {
      setLoading(false);
    }
  };

  const proceedAnyway = async () => {
    setShowValidationModal(false);

    try {
      setLoading(true);
      const offerData = {
        driverId: driver._id,
        driverName: driver.name,
        tripType,
        pickupAddress,
        dropAddress,
        distance: parseFloat(distance),
        amount: parseFloat(amount) + PLATFORM_FEE, // Add platform fee to the amount
        pickupTimeStart: pickupTimeStart.toISOString(),
        pickupTimeEnd: pickupTimeEnd.toISOString(),
      };

      const result = await CreateOfferAPI(offerData);
      if (result?.data?.success) {
        ToastAndroid.show("Offer created successfully!", ToastAndroid.LONG);
        router.push("/(tabs)/offers");
      }
    } catch (error) {
      console.log(error);
      // Error toast is already shown in CreateOfferAPI
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Offer</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Trip Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Trip Type</Text>
          <View style={styles.tripTypeContainer}>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                tripType === "One Way" && styles.tripTypeButtonActive,
              ]}
              onPress={() => setTripType("One Way")}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === "One Way" && styles.tripTypeTextActive,
                ]}
              >
                One Way
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                tripType === "Round Trip" && styles.tripTypeButtonActive,
              ]}
              onPress={() => setTripType("Round Trip")}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === "Round Trip" && styles.tripTypeTextActive,
                ]}
              >
                Round Trip
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pickup Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Pickup Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pickup location"
            placeholderTextColor="#666"
            value={pickupAddress}
            onChangeText={setPickupAddress}
            multiline
          />
        </View>

        {/* Drop Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Drop Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter drop location"
            placeholderTextColor="#666"
            value={dropAddress}
            onChangeText={setDropAddress}
            multiline
          />
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.label}>
            {tripType === "Round Trip" ? "Total Distance (Round Trip)" : "Distance (One Way)"} (KM)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter distance in kilometers"
            placeholderTextColor="#666"
            value={distance}
            onChangeText={setDistance}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Ride Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#666"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          {amount && parseFloat(amount) > 0 && (
            <View style={styles.platformFeeContainer}>
              <Ionicons name="information-circle" size={16} color="#FFA500" />
              <Text style={styles.platformFeeText}>
                ₹{PLATFORM_FEE} will be added as platform fee. Total: ₹{(parseFloat(amount) + PLATFORM_FEE).toFixed(0)}
              </Text>
            </View>
          )}
          {amount && distance && parseFloat(amount) > 0 && parseFloat(distance) > 0 && (
            <Text style={styles.pricePerKm}>
              ₹{((parseFloat(amount) + PLATFORM_FEE) / parseFloat(distance)).toFixed(2)} per km (including platform fee)
            </Text>
          )}
        </View>

        {/* Pickup Time Range */}
        <View style={styles.section}>
          <Text style={styles.label}>Pickup Time Range</Text>
          <Text style={styles.helperText}>
            Set the time window when you can pick up customers
          </Text>
          
          {/* Start Time */}
          <TouchableOpacity
            style={styles.timeButton}
            onPress={handleStartTimePress}
          >
            <MaterialIcons name="access-time" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <Text style={styles.timeValue}>
                {formatDate(pickupTimeStart)} at {formatTime(pickupTimeStart)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* End Time */}
          <TouchableOpacity
            style={styles.timeButton}
            onPress={handleEndTimePress}
          >
            <MaterialIcons name="access-time" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.timeLabel}>End Time</Text>
              <Text style={styles.timeValue}>
                {formatDate(pickupTimeEnd)} at {formatTime(pickupTimeEnd)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* Time Range Info */}
          <View style={styles.rangeInfo}>
            <Ionicons name="information-circle" size={18} color={colors.primary} />
            <Text style={styles.rangeInfoText}>
              Time window: {calculateHoursDifference(pickupTimeStart, pickupTimeEnd).toFixed(1)} hours
            </Text>
          </View>
        </View>

        {/* Create Offer Button */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateOffer}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Offer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={currentPickerTarget === 'start' ? pickupTimeStart : pickupTimeEnd}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={currentPickerTarget === 'start' ? pickupTimeStart : pickupTimeEnd}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Time Range Validation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showValidationModal}
        onRequestClose={() => setShowValidationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="time" size={50} color={colors.primary} />
            <Text style={styles.modalTitle}>Short Time Range</Text>
            <Text style={styles.modalMessage}>
              Your pickup time range is less than 3 hours.{"\n\n"}
              We recommend setting at least a 3-hour window to give more customers a chance to accept your offer.{"\n\n"}
              Current range: {calculateHoursDifference(pickupTimeStart, pickupTimeEnd).toFixed(1)} hours
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowValidationModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Adjust Time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={proceedAnyway}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalButtonPrimaryText}>Proceed Anyway</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateOffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  pricePerKm: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 5,
    fontWeight: "600",
  },
  platformFeeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    padding: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FFA500",
  },
  platformFeeText: {
    fontSize: 13,
    color: "#FFA500",
    fontWeight: "600",
    flex: 1,
  },
  tripTypeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1a1a1a",
    alignItems: "center",
  },
  tripTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tripTypeText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  tripTypeTextActive: {
    color: "#fff",
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  timeLabel: {
    fontSize: 12,
    color: "#999",
  },
  timeValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginTop: 2,
  },
  rangeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  rangeInfoText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  modalButtonPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
