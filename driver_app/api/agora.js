import axios from "axios";
import { ToastAndroid } from "react-native";

const url = "https://mrcuban-dashboard-backend.onrender.com/api/v1";

/**
 * Generate Agora token for voice call
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
 * Send call notification to customer
 * @param {string} receiverId - Customer ID
 * @param {string} callerName - Driver name
 * @param {string} channelName - Channel name for the call
 * @param {string} callerId - Driver ID (caller)
 * @returns {Promise}
 */
export const SendCallNotificationAPI = async (receiverId, callerName, channelName, callerId) => {
  try {
    const response = await axios.post(`${url}/send-call-notification`, {
      receiverId,
      callerName,
      channelName,
      isDriver: true,
      callerId, // Pass caller ID so customer can reject
    });
    return response;
  } catch (error) {
    console.log("Send Call Notification Error:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Send call rejection to caller
 * @param {string} callerId - Caller ID (customer who initiated the call)
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
      isDriver: true, // Driver is rejecting, so send to customer
    });
    return response;
  } catch (error) {
    console.log("Reject Call Error:", error?.response?.data || error.message);
    throw error;
  }
};
