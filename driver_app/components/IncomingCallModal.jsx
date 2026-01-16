import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../assets/color";
import Ionicons from "@expo/vector-icons/Ionicons";

const IncomingCallModal = ({ visible, onAccept, onReject, callerName, callerImage }) => {
  const [ringDuration, setRingDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (visible) {
      setRingDuration(0);
      interval = setInterval(() => {
        setRingDuration((prev) => {
          if (prev >= 30) {
            // Auto-reject after 30 seconds
            onReject();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onReject}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Caller Info */}
          <View style={styles.callerInfo}>
            <View style={styles.avatar}>
              {callerImage ? (
                <Image source={{ uri: callerImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={80} color="#fff" />
              )}
            </View>
            <Text style={styles.callerName}>{callerName}</Text>
            <Text style={styles.status}>Incoming Voice Call...</Text>
          </View>

          {/* Ringing Animation */}
          <View style={styles.ringingContainer}>
            <View style={[styles.ripple, styles.ripple1]} />
            <View style={[styles.ripple, styles.ripple2]} />
            <View style={[styles.ripple, styles.ripple3]} />
            <Ionicons name="call" size={40} color="#fff" style={styles.callIcon} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
              <Ionicons name="close" size={35} color="#fff" />
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Ionicons name="call" size={35} color="#fff" />
              <Text style={styles.buttonText}>Accept</Text>
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
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  callerInfo: {
    alignItems: "center",
    marginTop: 60,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  callerName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    color: "#ccc",
  },
  ringingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  ripple: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(76, 175, 80, 0.3)",
    borderWidth: 2,
    borderColor: "rgba(76, 175, 80, 0.5)",
  },
  ripple1: {
    transform: [{ scale: 1 }],
  },
  ripple2: {
    transform: [{ scale: 1.3 }],
    opacity: 0.7,
  },
  ripple3: {
    transform: [{ scale: 1.6 }],
    opacity: 0.4,
  },
  callIcon: {
    zIndex: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rejectButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  acceptButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    fontWeight: "600",
  },
});

export default IncomingCallModal;
