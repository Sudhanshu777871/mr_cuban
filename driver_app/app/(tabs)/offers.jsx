import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetDriverOffersAPI } from "../../api/offer";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { colors } from "../../assets/color";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import img from "../../assets/img/taxi-app.gif";
import img2 from "../../assets/img/noorder.png";

const OfferCard = ({ item, onPress }) => {
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

  const getStatusColor = (item) => {
    // For accepted offers, show ride status color
    if (item.status === "accepted" && item.rideStatus) {
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
    }

    // For other statuses
    switch (item.status) {
      case "active":
        return "#FFD700";
      case "accepted":
        return colors.primary;
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const getStatusText = (item) => {
    // For accepted offers, show ride status
    if (item.status === "accepted" && item.rideStatus) {
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
    }

    // For other statuses
    switch (item.status) {
      case "active":
        return "Active";
      case "accepted":
        return "Accepted";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return item.status.charAt(0).toUpperCase() + item.status.slice(1);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.tripTypeBadge}>
          <MaterialIcons name="route" size={14} color="#fff" />
          <Text style={styles.tripTypeText}>{item.tripType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
          <Text style={styles.statusText}>{getStatusText(item)}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.pickupAddress}
          </Text>
        </View>
        <View style={styles.locationDivider}>
          <View style={styles.dottedLine} />
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color="#f44336" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.dropAddress}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#999" />
          <Text style={styles.detailText}>
            {formatDate(item.pickupTimeStart)} - {formatDate(item.pickupTimeEnd)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color="#999" />
          <Text style={styles.detailText}>
            {formatTime(item.pickupTimeStart)} - {formatTime(item.pickupTimeEnd)}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.distanceContainer}>
          <MaterialIcons name="straighten" size={16} color="#999" />
          <Text style={styles.distanceText}>{item.distance} KM</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Amount:</Text>
          <Text style={styles.priceValue}>₹{item.amount}</Text>
        </View>
      </View>

      {item.status === "accepted" && item.acceptedBy && (
        <View style={styles.acceptedInfo}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.acceptedText}>
            Accepted by {item.acceptedBy.customerName}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Offers = () => {
  const router = useRouter();
  const driver = useSelector((state) => state.user.user);
  const [activeTab, setActiveTab] = useState("current");
  const [currentOffers, setCurrentOffers] = useState([]);
  const [historyOffers, setHistoryOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = async (showLoader = true) => {
    if (!driver?._id) return;

    try {
      if (showLoader) setLoading(true);

      // Fetch current offers (active + accepted)
      const currentResult = await GetDriverOffersAPI(driver._id, "active,accepted", 1);
      if (currentResult?.data?.offers) {
        setCurrentOffers(currentResult.data.offers);
      } else {
        setCurrentOffers([]);
      }

      // Fetch history offers (completed + cancelled)
      const historyResult = await GetDriverOffersAPI(driver._id, "completed,cancelled", 1);
      if (historyResult?.data?.offers) {
        setHistoryOffers(historyResult.data.offers);
      } else {
        setHistoryOffers([]);
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

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchOffers(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [driver?._id]);

  const handleOfferPress = (offer) => {
    router.push({
      pathname: "/(offer)/offer-detail",
      params: {
        id: offer._id,
        offer: JSON.stringify(offer),
      },
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={img2}
        resizeMode="contain"
        style={{ width: 250, height: 250, objectFit: "contain" }}
      />
      <Text style={styles.emptyTitle}>No Offers Yet</Text>
      <Text style={styles.emptyMessage}>
        {activeTab === "current"
          ? "Create your first offer to connect with customers"
          : "Your completed and cancelled offers will appear here"}
      </Text>
    </View>
  );

  const displayedOffers = activeTab === "current" ? currentOffers : historyOffers;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>My Offers</Text>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.tabActive]}
          onPress={() => setActiveTab("current")}
        >
          <Text style={[styles.tabText, activeTab === "current" && styles.tabTextActive]}>
            Current Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.tabActive]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Image
            source={img}
            resizeMode="contain"
            style={{ width: 300, height: 300, objectFit: "contain" }}
          />
        </View>
      ) : displayedOffers.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayedOffers}
          renderItem={({ item }) => (
            <OfferCard item={item} onPress={() => handleOfferPress(item)} />
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

      {/* Floating Create Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/(offer)/create-offer")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Offers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerTitle: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 4,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: colors.primary,
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
    color: "#454545",
    marginTop: 10,
  },
  emptyMessage: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tripTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tripTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    flex: 1,
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  locationDivider: {
    marginLeft: 8,
    marginVertical: 4,
  },
  dottedLine: {
    width: 2,
    height: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
    borderStyle: "dotted",
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    color: "#666",
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  distanceText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceLabel: {
    color: "#666",
    fontSize: 13,
  },
  priceValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  acceptedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  acceptedText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
