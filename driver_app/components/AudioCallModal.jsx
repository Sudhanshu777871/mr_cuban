import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { colors } from "../assets/color";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";
import { GenerateAgoraTokenAPI } from "../api/agora";
import * as Notifications from "expo-notifications";

const AudioCallModal = ({ visible, onClose, customerName, channelName, appId, isIncomingCall = false }) => {
  const [engine, setEngine] = useState(null);
  const [callState, setCallState] = useState("idle"); // idle, ringing, connected, ended
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [token, setToken] = useState(null);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);

  const rejectionListener = useRef();

  useEffect(() => {
    if (visible && channelName) {
      initializeAgora();
    }

    return () => {
      if (engine) {
        leaveChannel();
      }
    };
  }, [visible, channelName]);

  // Listen for call rejection notifications
  useEffect(() => {
    if (visible && channelName && !isIncomingCall) {
      // Only listen for rejections on outgoing calls
      rejectionListener.current = Notifications.addNotificationReceivedListener((notification) => {
        const title = notification.request.content.title;
        const data = notification.request.content.data;

        if (title === "Call Declined" && data?.type === "call_rejected" && data?.channelName === channelName) {
          console.log("[AudioCallModal] Call was rejected by receiver");
          ToastAndroid.show(notification.request.content.body, ToastAndroid.LONG);
          onClose(); // Close the modal
        }
      });

      return () => {
        if (rejectionListener.current) {
          Notifications.removeNotificationSubscription(rejectionListener.current);
        }
      };
    }
  }, [visible, channelName, isIncomingCall]);

  // Start timer only when both users are connected
  useEffect(() => {
    let interval;
    if (callState === "connected" && remoteUserJoined) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState, remoteUserJoined]);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "This app needs access to your microphone for voice calls.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true;
  };

  const initializeAgora = async () => {
    try {
      // Set initial state based on whether it's incoming or outgoing call
      setCallState(isIncomingCall ? "connected" : "ringing");

      // Request microphone permission
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        ToastAndroid.show("Microphone permission denied", ToastAndroid.SHORT);
        onClose();
        return;
      }

      console.log("Generating token for channel:", channelName);
      // Generate token from backend
      const response = await GenerateAgoraTokenAPI(channelName);
      console.log("Token response:", response.data);
      const { token: agoraToken, appId: agoraAppId } = response.data.data;
      setToken(agoraToken);
      console.log("Token generated successfully");

      // Create Agora engine
      const agoraEngine = createAgoraRtcEngine();
      agoraEngine.initialize({
        appId: appId || agoraAppId,
      });

      // Register event handlers
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          console.log("Successfully joined channel:", channelName);
          setIsConnected(true);
          // For incoming calls, we're already in connected state
          // For outgoing calls, we'll wait for the remote user to join
          if (!isIncomingCall) {
            console.log("Waiting for customer to answer...");
          }
        },
        onUserJoined: (connection, uid) => {
          console.log("Remote user joined:", uid);
          setRemoteUserJoined(true);
          setCallState("connected");
          ToastAndroid.show(`${customerName} answered`, ToastAndroid.SHORT);
        },
        onUserOffline: (connection, uid) => {
          console.log("Remote user left:", uid);
          setRemoteUserJoined(false);
          setCallState("ended");
          ToastAndroid.show("Call ended", ToastAndroid.SHORT);
          setTimeout(() => onClose(), 1000);
        },
        onError: (err) => {
          console.log("Agora error:", err);
        },
      });

      // Enable audio
      agoraEngine.enableAudio();

      // Set channel profile to communication (for voice calls)
      agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);

      // Set client role to broadcaster (can send and receive audio)
      agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      // Enable built-in echo cancellation and noise suppression
      agoraEngine.setAudioProfile(
        0, // Default audio profile
        3  // Scenario: Communication - enables echo cancellation
      );

      // Adjust recording signal volume (0-400, 100 is default)
      agoraEngine.adjustRecordingSignalVolume(100);

      // Adjust playback signal volume (0-400, 100 is default)
      agoraEngine.adjustPlaybackSignalVolume(100);

      // Enable speaker by default for calls
      agoraEngine.setDefaultAudioRouteToSpeakerphone(true);
      agoraEngine.setEnableSpeakerphone(true);
      setIsSpeaker(true);

      // Join channel
      agoraEngine.joinChannel(agoraToken, channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

      setEngine(agoraEngine);
    } catch (error) {
      console.log("Initialize Agora Error:", error);
      console.log("Error details:", error.response?.data || error.message);
      ToastAndroid.show(
        error.response?.data?.msg || "Failed to initialize call",
        ToastAndroid.LONG
      );
      setCallState("ended");
      setTimeout(() => onClose(), 1000);
    }
  };

  const leaveChannel = async () => {
    if (engine) {
      await engine.leaveChannel();
      engine.release();
      setEngine(null);
      setIsConnected(false);
      setRemoteUserJoined(false);
      setCallDuration(0);
      setCallState("idle");
    }
  };

  const toggleMute = () => {
    if (engine) {
      engine.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeaker = () => {
    if (engine) {
      engine.setEnableSpeakerphone(!isSpeaker);
      setIsSpeaker(!isSpeaker);
    }
  };

  const endCall = async () => {
    await leaveChannel();
    onClose();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={endCall}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Voice Call</Text>
          </View>

          {/* Customer Info */}
          <View style={styles.customerInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
            <Text style={styles.customerName}>{customerName}</Text>
            {callState === "ringing" ? (
              <Text style={styles.status}>Ringing...</Text>
            ) : callState === "connected" && remoteUserJoined ? (
              <Text style={styles.status}>{formatDuration(callDuration)}</Text>
            ) : callState === "connected" && !remoteUserJoined ? (
              <Text style={styles.status}>Connecting...</Text>
            ) : callState === "ended" ? (
              <Text style={styles.status}>Call Ended</Text>
            ) : (
              <Text style={styles.status}>Connecting...</Text>
            )}
          </View>

          {/* Loading Indicator - show during ringing or connecting */}
          {(callState === "ringing" || (callState === "connected" && !remoteUserJoined)) && (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
          )}

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={toggleMute}
              disabled={callState !== "connected" || !remoteUserJoined}
            >
              <Ionicons
                name={isMuted ? "mic-off" : "mic"}
                size={30}
                color={isMuted ? "#fff" : callState === "connected" && remoteUserJoined ? colors.primary : "#666"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isSpeaker && styles.controlButtonActive]}
              onPress={toggleSpeaker}
              disabled={callState !== "connected" || !remoteUserJoined}
            >
              <Ionicons
                name={isSpeaker ? "volume-high" : "volume-low"}
                size={30}
                color={isSpeaker ? "#fff" : callState === "connected" && remoteUserJoined ? colors.primary : "#666"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
              <Ionicons name="call" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  header: {
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  customerInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  customerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: "#ccc",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingBottom: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  controlButtonActive: {
    backgroundColor: colors.primary,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioCallModal;
