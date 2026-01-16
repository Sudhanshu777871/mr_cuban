import {
  Alert,
  Button,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Modal
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../assets/color";
import img from "../../assets/img/ax.jpeg";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import Feather from "@expo/vector-icons/Feather";
import {
  DeleteRide,
  GetActiveRides,
  GetHomeCommentsAPI,
  GetRides,
  SavedPushNotificationToken,
} from "../../api/other";
import EmptyRideCard from "../../components/EmptyRideCard";
import StaticRideCard from "../../components/StaticRideCard";
import RatingCard from "../../components/RatingCard";
import RatingCard2 from "../../components/RatingCard2";
import RatingCard3 from "../../components/RatingCard3";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadApi } from "../../api/auth";
import millify from 'millify';
import IncomingCallScreen from "../../components/IncomingCallScreen";
import AudioCallModal from "../../components/AudioCallModal";

// import for modal for update

import * as Linking from "expo-linking";
import { checkForAppUpdate } from "../../helper/versionChecker";




//configurations
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync(id) {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "MR Cuban Notifications", // Channel name for MR Cuban app
      importance: Notifications.AndroidImportance.MAX, // Highest importance (sound and heads-up alert)
      vibrationPattern: [0, 250, 250, 250], // Vibration pattern
      lightColor: "#FF231F7C", // Custom LED color (on supported devices)
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, // Show notification content on lock screen
      sound: "default", // Default notification sound
      enableVibrate: true, // Enable vibration for the notification
      enableLights: true, // Enable LED light for notifications
      bypassDnd: true, // Allow notifications to bypass Do Not Disturb mode
      showBadge: true,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    // Allow notifications even without projectId (for Expo Go compatibility)
    // if (!projectId) {
    //   handleRegistrationError("Project ID not found");
    //   return
    // }
    try {
      // Get push token - with or without projectId
      let pushTokenString;
      if (projectId) {
        pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } else {
        // For Expo Go compatibility - no projectId needed
        pushTokenString = (await Notifications.getExpoPushTokenAsync()).data;
      }
      const pushToken = await AsyncStorage.getItem("pushToken");
      if (pushToken===pushTokenString) return pushTokenString;
      const data = await SavedPushNotificationToken(id, pushTokenString);
      if (data?.data?.data?.token){
        await AsyncStorage.setItem("pushToken",data?.data?.data?.token);
        return pushTokenString
      };
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const home = () => {
  const { user, amount,uf } = useSelector((state) => state.user);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [rides, setRides] = useState([]);
  const [rideLoading, setRideLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const dispatch = useDispatch();
    // usestate for handel the update popup
    const [showPopup, setShowPopup] = useState(false);
    const [updateInfo, setUpdateInfo] = useState(null);

  // Incoming call state
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [callModalVisible, setCallModalVisible] = useState(false);
  


  const FetchRides = async () => {
    try {
      setRideLoading(true);
      const result = await GetActiveRides(user?._id);

      if (result?.data?.data) {
        setRides(result?.data?.data);
      } else {
        setRides([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRideLoading(false);
    }
  };

  const HomeComments = async () => {
    try {
      setCommentLoading(true);
      const result = await GetHomeCommentsAPI(user?._id);
      if (result?.data?.data) {
        setComments(result?.data?.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const deleteRide = async (id) => {
    try {
      setRideLoading(true);
      const result = await DeleteRide(id);
      if (result?.data?.data) {
        ToastAndroid.show("Ride Delete Successfully", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRideLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      Alert.alert(
        "Delete Ride",
        "Are you sure you want to delete this ride?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => deleteRide(id),
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console;
    }
  };


  


  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const result = await LoadApi(token);
      if (result?.data?.data) {
        dispatch({
          type: "load",
          payload: { data: result?.data?.data, total: result?.data?.total },
        });
        dispatch({type:"force_call",payload:true})
      }
    } catch (error) {
      console.log(error);
    } 
    
  };

  useEffect(() => {
    if(uf===false){
      fetchUserDetails()
    }
  }, [uf]);







  useEffect(() => {
    if (user?._id) {
      FetchRides();
      HomeComments();
    }
  }, [user?._id]);

  // Function for fetch universal notifications

  useEffect(() => {

        // Store app info for version checking
        const initializeAppInfo = async () => {
          await AsyncStorage.setItem("appFor", "driver");
          await AsyncStorage.setItem("appVersion", "8.0.0");
        };

        initializeAppInfo();

        // function for check app latest version
        const verifyVersion = async () => {
          const result = await checkForAppUpdate();

          if (result.updateRequired) {
            setUpdateInfo(result.latestVersion);
            setShowPopup(true);
          } else {
            setShowPopup(false);
          }
        };

        verifyVersion(); // function for check app latest version


    registerForPushNotificationsAsync(user?._id)
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);

        // Check if this is an incoming call notification
        const title = notification.request.content.title;
        const body = notification.request.content.body;

        if (title === "Incoming Call") {
          // Extract caller name from body "Customer Name is calling you..."
          const callerName = body.replace(" is calling you...", "");
          const channelName = notification.request.content.data?.channelName || "";

          console.log("Incoming call notification received:");
          console.log("- Caller:", callerName);
          console.log("- Channel:", channelName);

          setIncomingCallData({
            callerName,
            channelName,
          });
          setShowIncomingCall(true);
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response);

        // Check if this is a call notification
        const title = response.notification.request.content.title;
        const data = response.notification.request.content.data;

        if (title === "Incoming Call" && data?.channelName) {
          const callerName = response.notification.request.content.body.replace(" is calling you...", "");

          console.log("Opening incoming call screen from notification tap");
          setIncomingCallData({
            callerName,
            channelName: data.channelName,
          });
          setShowIncomingCall(true);
        }
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  const handleUpdateNow = () => {
    setShowPopup(false);
    if (updateInfo?.apkUrl) {
      Linking.openURL(updateInfo.apkUrl);
    }
  };

  const handleLater = async () => {
    setShowPopup(false);

    // Set "lastCheckTime" even when user skips update, so it respects the admin config time
    if (updateInfo?.timeToShow) {
      const nextCheckTime = new Date();
      nextCheckTime.setHours(nextCheckTime.getHours() + updateInfo.timeToShow);
      await AsyncStorage.setItem("lastCheckTime", nextCheckTime.toISOString());
    }
  };

  // Handle accepting incoming call
  const handleAcceptCall = () => {
    console.log("Call accepted, opening call modal");
    setShowIncomingCall(false);
    setCallModalVisible(true);
  };

  // Handle rejecting incoming call
  const handleRejectCall = () => {
    console.log("Call rejected");
    setShowIncomingCall(false);
    setIncomingCallData(null);
  };

  return (
    <>
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <View style={styles.head}>
        <Text style={styles.l1}>
          Mr Cuban <Text style={styles.l2}>Partners</Text>
        </Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/notification" })}
        >
          <View style={styles.bell}>
            <Feather name="bell" size={18} color="#454545" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.banner}>
        <Text style={styles.p1}>Total Earnings</Text>
        <Text style={styles.p2}>₹{millify(Number(amount))}</Text>
        <Text style={styles.p}>
          Welcome to your driving partner. Stay in control, pick up more rides,
          and boost your earnings effortlessly.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.h2}>My Rides</Text>
        <Text style={styles.p3}>
          Your ride, your pride – every vehicle, ready to hit the road!
        </Text>

        <View style={styles.model}>
          {rideLoading ? (
            <FlatList
              horizontal
              data={[1, 2, 3]}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <StaticRideCard
                  index={index}
                  flag={false}
                  handleDelete={handleDelete}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          ) : rideLoading === false && rides?.length === 0 ? (
            <EmptyRideCard />
          ) : (
            <FlatList
              horizontal
              data={rides}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <StaticRideCard
                  flag={true}
                  item={item}
                  handleDelete={handleDelete}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        <Text style={styles.h2}>Customer Feedbacks</Text>
        <Text style={styles.p3}>
          We value every comment and rating from our valued customers and
          showcase the top feedback on our platform.
        </Text>
        <View style={styles.model}>
          {commentLoading ? (
            <FlatList
              horizontal
              data={[1, 2, 3]}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => <RatingCard3 flag={false} />}
              showsHorizontalScrollIndicator={false}
            />
          ) : commentLoading === false && comments?.length === 0 ? (
            <RatingCard2 />
          ) : (
            <FlatList
              horizontal
              data={comments}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <RatingCard index={index} item={item} />
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
       {/* code for modal for update available */}
       <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>New Version Available 🚀</Text>
            <Text style={styles.popupMsg}>
              {updateInfo?.appMsg ||
                "A new version of the app is available. Please update now."}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleLater}
                style={[styles.popupButton, { backgroundColor: "gray" }]}
              >
                <Text style={styles.popupBtnText}>Later</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateNow}
                style={[styles.popupButton, { backgroundColor: "#E27E05" }]}
              >
                <Text style={styles.popupBtnText}>Update Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>

      {/* Incoming Call Screen */}
      <IncomingCallScreen
        visible={showIncomingCall}
        callerName={incomingCallData?.callerName || "Customer"}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />

      {/* Audio Call Modal */}
      <AudioCallModal
        visible={callModalVisible}
        onClose={() => {
          setCallModalVisible(false);
          setIncomingCallData(null);
        }}
        customerName={incomingCallData?.callerName || "Customer"}
        channelName={incomingCallData?.channelName || ""}
        isIncomingCall={showIncomingCall || !!incomingCallData}
      />
    </>
  );
};

export default home;
const styles = StyleSheet.create({
  head: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  l1: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "bold",
    color: colors.primary,
  },
  l2: {
    color: "#000",
  },
  bell: {
    width: 30,
    height: 30,
    borderColor: "#f5f5f5",
    borderWidth: 1,
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
  },
  h1: {
    fontSize: 16,
    marginTop: 15,
    color: "#fff",
    fontWeight: "bold",
  },
  banner: {
    width: "100%",
    height: 150,
    backgroundColor: colors.dark, // Set a background color to make the shadow visible
    shadowColor: "rgba(100, 100, 111, 0.8)", // Equivalent shadow color
    shadowOffset: { width: 0, height: 7 }, // Equivalent to 0px 7px
    shadowOpacity: 1, // Adjust to match opacity
    shadowRadius: 29, // Equivalent to 29px
    elevation: 6,
    marginTop: 20,
    borderRadius: 5,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  p1: {
    color: "#fff",
    fontSize: 14,
  },
  p2: {
    color: "#fff",
    fontSize: 22,
    marginTop: 5,
  },
  p: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 15,
    marginTop: 5,
  },
  h2: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 20,
  },
  p3: {
    color: "#454545",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  model: {
    marginTop: 15,
  },
  // css code for handel the update modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    width: "100%",
    elevation: 10,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  popupMsg: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  popupBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
