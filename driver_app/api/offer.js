import axios from "axios";
import { ToastAndroid } from "react-native";

let url = "https://mrcuban-dashboard-backend.onrender.com/api/v1";

export const CreateOfferAPI = async (offerData) => {
  try {
    return await axios.post(`${url}/create-offer`, offerData, {
      timeout: 15000, // 15 second timeout
    });
  } catch (error) {
    console.log(error);
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      ToastAndroid.show("Connection timeout. Please check your internet.", ToastAndroid.LONG);
    } else if (error.response) {
      ToastAndroid.show(error.response.data?.msg || "Failed to create offer", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Network error. Please try again.", ToastAndroid.SHORT);
    }
    throw error; // Re-throw to handle in component
  }
};

export const GetDriverOffersAPI = async (driverId, status, page = 1) => {
  try {
    return await axios.get(`${url}/driver-offers`, {
      params: {
        driverId,
        status,
        page,
        limit: 10,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const UpdateOfferStatusAPI = async (offerId, status) => {
  try {
    return await axios.put(`${url}/update-offer-status`, {
      offerId,
      status,
    });
  } catch (error) {
    console.log(error?.response);
    ToastAndroid.show("Failed to update offer status", ToastAndroid.SHORT);
  }
};

export const StartOfferRideAPI = async (driverOrderId, otp) => {
  try {
    if (!driverOrderId) {
      ToastAndroid.show("Error: Missing order information", ToastAndroid.SHORT);
      console.log("Driver Order ID is missing");
      return null;
    }

    return await axios.get(`${url}/start-offer-ride`, {
      params: {
        id: driverOrderId,
        otp,
      },
    });
  } catch (error) {
    if (error?.response?.status === 400 && error?.response?.data?.msg === "Invalid OTP") {
      ToastAndroid.show("Invalid OTP", ToastAndroid.SHORT);
    } else if (error?.response?.status === 404) {
      ToastAndroid.show("Ride not found. Please refresh and try again.", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Failed to start ride", ToastAndroid.SHORT);
    }
    console.log("Start Offer Ride Error:", error?.response?.data || error.message);
    throw error;
  }
};

export const FinishOfferRideAPI = async (driverOrderId) => {
  try {
    return await axios.get(`${url}/finish-offer-ride`, {
      params: {
        id: driverOrderId,
      },
    });
  } catch (error) {
    console.log(error);
    ToastAndroid.show("Failed to finish ride", ToastAndroid.SHORT);
  }
};

export const CancelUnacceptedOfferAPI = async (offerId) => {
  try {
    return await axios.get(`${url}/cancel-unaccepted-offer`, {
      params: {
        offerId,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMsg = error?.response?.data?.msg || "Failed to cancel offer";
    ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
    throw error;
  }
};
