import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useSelector } from "react-redux";
import { ToastAndroid } from "react-native";
import IncomingCallScreen from "../components/IncomingCallScreen";
import AudioCallModal from "../components/AudioCallModal";
import { RejectCallAPI } from "../api/agora";

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within CallProvider");
  }
  return context;
};

export const CallProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callRejected, setCallRejected] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (!user?._id) return;

    // Listen for incoming notifications (when app is in foreground)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("[CallContext] Notification received:", notification);

        const title = notification.request.content.title;
        const body = notification.request.content.body;
        const data = notification.request.content.data;

        if (title === "Incoming Call" && data?.type === "incoming_call") {
          const callerName = body.replace(" is calling you...", "");
          const channelName = data?.channelName || "";
          const callerId = data?.callerId || "";

          console.log("[CallContext] Incoming call from:", callerName, "Channel:", channelName, "Caller ID:", callerId);

          setIncomingCallData({
            callerName,
            channelName,
            callerId, // Store caller ID for rejection
          });
          setShowIncomingCall(true);
        } else if (title === "Call Declined" && data?.type === "call_rejected") {
          console.log("[CallContext] Call was rejected, channel:", data?.channelName);
          setCallRejected(true);
          setCallModalVisible(false);
          ToastAndroid.show(body, ToastAndroid.LONG);
        }
      });

    // Listen for notification taps (when app is in background/closed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[CallContext] Notification tapped:", response);

        const title = response.notification.request.content.title;
        const data = response.notification.request.content.data;

        if (title === "Incoming Call" && data?.channelName) {
          const callerName = response.notification.request.content.body.replace(" is calling you...", "");
          const callerId = data?.callerId || "";

          console.log("[CallContext] Opening incoming call screen from notification tap");
          setIncomingCallData({
            callerName,
            channelName: data.channelName,
            callerId, // Store caller ID for rejection
          });
          setShowIncomingCall(true);
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user?._id]);

  const handleAcceptCall = () => {
    console.log("[CallContext] Call accepted, opening call modal");
    setShowIncomingCall(false);
    setCallModalVisible(true);
  };

  const handleRejectCall = async () => {
    console.log("[CallContext] Call rejected");

    try {
      if (incomingCallData?.callerId) {
        await RejectCallAPI(
          incomingCallData.callerId,
          user?.name || "Driver",
          incomingCallData.channelName
        );
        console.log("[CallContext] Rejection notification sent");
      }
    } catch (error) {
      console.log("[CallContext] Failed to send rejection:", error);
    }

    setShowIncomingCall(false);
    setIncomingCallData(null);
  };

  const startOutgoingCall = (callerName, channelName) => {
    console.log("[CallContext] Starting outgoing call to:", callerName);
    setIncomingCallData({
      callerName,
      channelName,
    });
    setCallModalVisible(true);
  };

  return (
    <CallContext.Provider
      value={{
        showIncomingCall,
        incomingCallData,
        callModalVisible,
        startOutgoingCall,
        setCallModalVisible,
      }}
    >
      {children}

      {/* Global Incoming Call Screen - shows on any page */}
      <IncomingCallScreen
        visible={showIncomingCall}
        callerName={incomingCallData?.callerName || "Customer"}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />

      {/* Global Audio Call Modal */}
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
    </CallContext.Provider>
  );
};
