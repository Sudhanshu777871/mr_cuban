import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
} from "react-native";
import { colors } from "../assets/color";
import Ionicons from "@expo/vector-icons/Ionicons";

// Optional: Import expo-av only if available
let Audio;
try {
  Audio = require("expo-av").Audio;
} catch (error) {
  console.log("expo-av not available, ringtone will be disabled");
}

const { width, height } = Dimensions.get("window");

const IncomingCallScreen = ({ visible, callerName, onAccept, onReject }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (visible) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Play ringtone
      playRingtone();

      // Prevent back button
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );

      return () => {
        backHandler.remove();
        stopRingtone();
      };
    } else {
      stopRingtone();
    }
  }, [visible]);

  const playRingtone = async () => {
    try {
      const { sound: ringtone } = await Audio.Sound.createAsync(
        require("../assets/ringtone.mp3"), // You'll need to add a ringtone file
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setSound(ringtone);
    } catch (error) {
      console.log("Error playing ringtone:", error);
    }
  };

  const stopRingtone = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.log("Error stopping ringtone:", error);
      }
    }
  };

  const handleAccept = async () => {
    await stopRingtone();
    onAccept();
  };

  const handleReject = async () => {
    await stopRingtone();
    onReject();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Caller Info */}
      <View style={styles.callerInfo}>
        <Text style={styles.incomingText}>Incoming Call</Text>
        <Animated.View
          style={[
            styles.avatarContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={80} color="#fff" />
          </View>
        </Animated.View>
        <Text style={styles.callerName}>{callerName}</Text>
        <Text style={styles.callerSubtext}>Customer is calling...</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Reject Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
          activeOpacity={0.7}
        >
          <View style={styles.buttonIcon}>
            <Ionicons name="close" size={35} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        {/* Accept Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
          activeOpacity={0.7}
        >
          <View style={styles.buttonIcon}>
            <Ionicons name="call" size={35} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    backgroundColor: "#000",
    zIndex: 9999,
    elevation: 9999,
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  callerInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  incomingText: {
    fontSize: 18,
    color: "#ccc",
    marginBottom: 40,
    letterSpacing: 1,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  callerName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  callerSubtext: {
    fontSize: 16,
    color: "#999",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  actionButton: {
    alignItems: "center",
    gap: 15,
  },
  buttonIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    // Empty - icon styling in buttonIcon
  },
  acceptButton: {
    // Empty - icon styling in buttonIcon
  },
  rejectButton: {
    buttonIcon: {
      backgroundColor: "#f44336",
    },
  },
  acceptButton: {
    buttonIcon: {
      backgroundColor: "#4CAF50",
    },
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

// Fix button icon colors
styles.rejectButton = {
  ...styles.rejectButton,
};
styles.acceptButton = {
  ...styles.acceptButton,
};

// Apply button icon background colors directly
const finalStyles = StyleSheet.create({
  ...styles,
  rejectButtonIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButtonIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
});

// Update component to use separate icon styles
const IncomingCallScreenWithStyles = ({ visible, callerName, onAccept, onReject }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (visible) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Play ringtone
      playRingtone();

      // Prevent back button
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );

      return () => {
        backHandler.remove();
        stopRingtone();
      };
    } else {
      stopRingtone();
    }
  }, [visible]);

  const playRingtone = async () => {
    // Ringtone is handled by system notification sound (high-priority push notification)
    // No need for in-app ringtone playback
    console.log("Incoming call ringtone handled by system notification");
    return;
  };

  const stopRingtone = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.log("Error stopping ringtone:", error);
      }
    }
  };

  const handleAccept = async () => {
    await stopRingtone();
    onAccept();
  };

  const handleReject = async () => {
    await stopRingtone();
    onReject();
  };

  if (!visible) return null;

  return (
    <View style={finalStyles.container}>
      {/* Caller Info */}
      <View style={finalStyles.callerInfo}>
        <Text style={finalStyles.incomingText}>Incoming Call</Text>
        <Animated.View
          style={[
            finalStyles.avatarContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={finalStyles.avatar}>
            <Ionicons name="person" size={80} color="#fff" />
          </View>
        </Animated.View>
        <Text style={finalStyles.callerName}>{callerName}</Text>
        <Text style={finalStyles.callerSubtext}>Customer is calling...</Text>
      </View>

      {/* Action Buttons */}
      <View style={finalStyles.actionsContainer}>
        {/* Reject Button */}
        <TouchableOpacity
          style={finalStyles.actionButton}
          onPress={handleReject}
          activeOpacity={0.7}
        >
          <View style={finalStyles.rejectButtonIcon}>
            <Ionicons name="close" size={35} color="#fff" />
          </View>
          <Text style={finalStyles.buttonText}>Decline</Text>
        </TouchableOpacity>

        {/* Accept Button */}
        <TouchableOpacity
          style={finalStyles.actionButton}
          onPress={handleAccept}
          activeOpacity={0.7}
        >
          <View style={finalStyles.acceptButtonIcon}>
            <Ionicons name="call" size={35} color="#fff" />
          </View>
          <Text style={finalStyles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomingCallScreenWithStyles;
