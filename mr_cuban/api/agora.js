import axios from "axios";
import { ToastAndroid } from "react-native";

const url = "https://mrcuban-dashboard-backend.onrender.com/api/v1";

/**
 * Generate Agora token for vhttps://8ba026303716.ngrok-free.appice call
 * @param {string} channelName - Unique channel name for the call
 * @param {string} uid - User ID (optional)
 * @returns {Promise} - Agora token and app details
 */
export const GenerateAgoraTokenAPI = async (channelName, uid = "0") => {
  try {
    const response = await axios.get(`${url}/generate-token`, {
      params: { channelName, uid, role: "publisher" },
    });
    return response;
  } catch (error) {
    console.log("Generate Token Error:", error?.response?.data || error.message);
    ToastAndroid.show("Failed to generate call token", ToastAndroid.SHORT);
    throw error;
  }
};

/**
 * Send call notification to driver
 * @param {string} receiverId - Driver ID
 * @param {string} callerName - Customer name
 * @param {string} channelName - Channel name for the call
 * @param {string} callerId - Customer ID (caller)
 * @returns {Promise}
 */
export const SendCallNotificationAPI = async (receiverId, callerName, channelName, callerId) => {
  try {
    const response = await axios.post(`${url}/send-call-notification`, {
      receiverId,
      callerName,
      channelName,
      isDriver: false,
      callerId, // Pass caller ID so driver can reject
    });
    return response;
  } catch (error) {
    console.log("Send Call Notification Error:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Send call rejection to caller
 * @param {string} callerId - Caller ID (driver who initiated the call)
 * @param {string} rejectorName - Name of person rejecting
 * @param {string} channelName - Channel name for the call
 * @returns {Promise}
 */
export const RejectCallAPI = async (callerId, rejectorName, channelName) => {
  try {
    const response = await axios.post(`${url}/reject-call`, {
      callerId,
      rejectorName,
      channelName,
      isDriver: false, // Customer is rejecting, so send to driver
    });
    return response;
  } catch (error) {
    console.log("Reject Call Error:", error?.response?.data || error.message);
    throw error;
  }
};
