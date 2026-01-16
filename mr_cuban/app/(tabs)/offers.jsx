import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/color";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { GetActiveOffersAPI, AcceptOfferAPI, GetCustomerOffersAPI } from "../../api/offer";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import img2 from "../../assets/img/nodata.png";
import img from "../../assets/img/taxi-app.gif";
import { router } from "expo-router";

const OfferDetailModal = ({ visible, offer, onClose, onAccept, accepting }) => {
  if (!offer) return null;

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

  const pricePerKm = (offer.amount / offer.distance).toFixed(2);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Offer Details</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Driver Info */}
            <View style={styles.driverSection}>
              <View style={styles.driverIconContainer}>
                <Ionicons name="person-circle" size={50} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.driverLabel}>Driver</Text>
                <Text style={styles.driverName}>{offer.driverName}</Text>
              </View>
            </View>

            {/* Trip Type */}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="route" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Trip Type</Text>
                <Text style={styles.detailValue}>{offer.tripType}</Text>
              </View>
            </View>

            {/* Locations */}
            <View style={styles.locationSection}>
              <View style={styles.locationItem}>
                <Ionicons name="location" size={24} color={colors.primary} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.locationLabel}>Pickup Location</Text>
                  <Text style={styles.locationValue}>{offer.pickupAddress}</Text>
                </View>
              </View>
              <View style={styles.locationDivider} />
              <View style={styles.locationItem}>
                <Ionicons name="location" size={24} color="#f44336" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.locationLabel}>Drop Location</Text>
                  <Text style={styles.locationValue}>{offer.dropAddress}</Text>
                </View>
              </View>
            </View>

            {/* Time Range */}
            <View style={styles.timeSection}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <MaterialIcons name="access-time" size={20} color={colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Pickup Time Window</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(offer.pickupTimeStart)}
                  </Text>
                  <Text style={styles.timeRange}>
                    Between {formatTime(offer.pickupTimeStart)} - {formatTime(offer.pickupTimeEnd)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Pricing Details */}
            <View style={styles.pricingSection}>
              <Text style={styles.pricingSectionTitle}>Pricing Details</Text>
              
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Distance</Text>
                <Text style={styles.pricingValue}>{offer.distance} KM</Text>
              </View>
              
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Price Per Kilometer</Text>
                <Text style={styles.pricingValue}>₹{pricePerKm}</Text>
              </View>
              
              <View style={styles.pricingDivider} />
              
              <View style={styles.pricingRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{offer.amount}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Accept Button */}
          {offer.status === "active" && (
            <TouchableOpacity
              style={[styles.acceptButton, accepting && styles.acceptButtonDisabled]}
              onPress={onAccept}
              disabled={accepting}
            >
              {accepting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.acceptButtonText}>Accept Offer</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const OfferCard = ({ item, onPress, showStatus }) => {
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
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = () => {
    if (!item.rideStatus) return colors.primary;
    switch (item.rideStatus) {
      case "accepted":
        return colors.primary;
      case "started":
        return "#FF9800";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const getStatusText = () => {
    if (!item.rideStatus) return "Accepted";
    switch (item.rideStatus) {
      case "accepted":
        return "Ready to Start";
      case "started":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.driverInfo}>
          <Ionicons name="person-circle" size={32} color={colors.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.driverNameCard}>{item.driverName}</Text>
            <Text style={styles.tripTypeBadgeText}>{item.tripType}</Text>
          </View>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.priceAmount}>₹{item.amount}</Text>
        </View>
      </View>

      {/* Status Badge for My Offers */}
      {showStatus && (
        <View style={[styles.rideStatusBadge, { backgroundColor: getStatusColor() }]}>
          <Ionicons
            name={
              item.rideStatus === "started" ? "play-circle" :
              item.rideStatus === "completed" ? "checkmark-circle" :
              item.rideStatus === "cancelled" ? "close-circle" :
              "time"
            }
            size={16}
            color="#fff"
          />
          <Text style={styles.rideStatusText}>{getStatusText()}</Text>
        </View>
      )}

      <View style={styles.cardLocations}>
        <View style={styles.cardLocationRow}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.cardLocationText} numberOfLines={1}>
            {item.pickupAddress}
          </Text>
        </View>
        <View style={styles.cardLocationRow}>
          <Ionicons name="location" size={16} color="#f44336" />
          <Text style={styles.cardLocationText} numberOfLines={1}>
            {item.dropAddress}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.cardFooterItem}>
          <Ionicons name="calendar" size={14} color="#666" />
          <Text style={styles.cardFooterText}>
            {formatDate(item.pickupTimeStart)}
          </Text>
        </View>
        <View style={styles.cardFooterItem}>
          <MaterialIcons name="straighten" size={14} color="#666" />
          <Text style={styles.cardFooterText}>{item.distance} KM</Text>
        </View>
        <View style={styles.cardFooterItem}>
          <Text style={styles.perKmText}>
            ₹{(item.amount / item.distance).toFixed(2)}/km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Offers = () => {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("available");
  const [availableOffers, setAvailableOffers] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const fetchOffers = async (showLoader = true) => {
    if (!user?._id) return;

    try {
      if (showLoader) setLoading(true);

      if (activeTab === "available") {
        const result = await GetActiveOffersAPI(1);
        if (result?.data?.offers) {
          setAvailableOffers(result.data.offers);
        } else {
          setAvailableOffers([]);
        }
      } else {
        const result = await GetCustomerOffersAPI(user._id, "accepted,completed", 1);
        if (result?.data?.offers) {
          setMyOffers(result.data.offers);
        } else {
          setMyOffers([]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOffers(false);
  };

  useEffect(() => {
    fetchOffers();

    // Auto-refresh every 10 seconds for available offers
    if (activeTab === "available") {
      const interval = setInterval(() => {
        fetchOffers(false);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, user?._id]);

  const handleOfferPress = (offer) => {
    if (activeTab === "myoffers") {
      // Navigate to offer detail screen for accepted offers
      router.push({
        pathname: "/(offer)/offer-detail",
        params: {
          id: offer._id,
          offer: JSON.stringify(offer),
        },
      });
    } else {
      // Show modal for available offers
      setSelectedOffer(offer);
      setModalVisible(true);
    }
  };

  const handleAcceptOffer = async () => {
    if (!selectedOffer || !user?._id) return;

    try {
      setAccepting(true);
      const result = await AcceptOfferAPI(
        selectedOffer._id,
        user._id,
        user.name
      );

      if (result?.data?.success) {
        setModalVisible(false);
        setSelectedOffer(null);
        // Switch to My Offers tab
        setActiveTab("myoffers");
        // Refresh offers will happen automatically when tab changes
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAccepting(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={img2}
        resizeMode="contain"
        style={{ width: 250, height: 250 }}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === "available" ? "No Offers Available" : "No Accepted Offers"}
      </Text>
      <Text style={styles.emptyMessage}>
        {activeTab === "available"
          ? "New offers from drivers will appear here"
          : "Your accepted offers will appear here"}
      </Text>
    </View>
  );

  const displayedOffers = activeTab === "available" ? availableOffers : myOffers;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Discover <Text style={{ color: colors.primary }}>Offers</Text>
        </Text>
        <Text style={styles.headerSubtitle}>
          Browse exclusive ride offers from drivers
        </Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "available" && styles.tabActive]}
          onPress={() => setActiveTab("available")}
        >
          <Text
            style={[styles.tabText, activeTab === "available" && styles.tabTextActive]}
          >
            Available Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "myoffers" && styles.tabActive]}
          onPress={() => setActiveTab("myoffers")}
        >
          <Text
            style={[styles.tabText, activeTab === "myoffers" && styles.tabTextActive]}
          >
            My Offers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Image
            source={img}
            resizeMode="contain"
            style={{ width: 300, height: 300 }}
          />
        </View>
      ) : displayedOffers.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayedOffers}
          renderItem={({ item }) => (
            <OfferCard
              item={item}
              onPress={() => handleOfferPress(item)}
              showStatus={activeTab === "myoffers"}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* Offer Detail Modal */}
      <OfferDetailModal
        visible={modalVisible}
        offer={selectedOffer}
        onClose={() => setModalVisible(false)}
        onAccept={handleAcceptOffer}
        accepting={accepting}
      />

      <StatusBar backgroundColor="#000" style="light" />
    </SafeAreaView>
  );
};

export default Offers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  emptyMessage: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  driverNameCard: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tripTypeBadgeText: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  priceBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardLocations: {
    marginBottom: 12,
  },
  cardLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  cardLocationText: {
    flex: 1,
    color: "#ccc",
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  cardFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardFooterText: {
    color: "#999",
    fontSize: 12,
  },
  perKmText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  rideStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  rideStatusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "90%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  driverSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252525",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  driverIconContainer: {
    marginRight: 12,
  },
  driverLabel: {
    color: "#999",
    fontSize: 12,
  },
  driverName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#252525",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  locationSection: {
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  locationLabel: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  locationValue: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  locationDivider: {
    height: 20,
    width: 2,
    backgroundColor: "#444",
    marginLeft: 12,
    marginVertical: 8,
  },
  timeSection: {
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  timeRange: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  pricingSection: {
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  pricingSectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
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
  acceptButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
