import axios from "axios";
import { ToastAndroid } from "react-native";

let url = "https://mrcuban-dashboard-backend.onrender.com/api/v1";

export const GetActiveOffersAPI = async (page = 1) => {
  try {
    return await axios.get(`${url}/active-offers`, {
      params: {
        page,
        limit: 10,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const AcceptOfferAPI = async (offerId, customerId, customerName) => {
  try {
    return await axios.post(`${url}/accept-offer`, {
      offerId,
      customerId,
      customerName,
    });
  } catch (error) {
    console.log(error?.response);
    if (error?.response?.data?.msg) {
      ToastAndroid.show(error.response.data.msg, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Failed to accept offer", ToastAndroid.SHORT);
    }
  }
};

export const GetCustomerOffersAPI = async (customerId, status, page = 1) => {
  try {
    return await axios.get(`${url}/customer-offers`, {
      params: {
        customerId,
        status,
        page,
        limit: 10,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const CancelOfferAPI = async (customerOrderId, driverOrderId) => {
  try {
    return await axios.get(`${url}/cancel-offer`, {
      params: {
        coi: customerOrderId,
        doi: driverOrderId,
      },
    });
  } catch (error) {
    console.log(error);
    ToastAndroid.show("Failed to cancel offer", ToastAndroid.SHORT);
  }
};

export const StartOfferRideAPI = async (driverOrderId, otp) => {
  try {
    return await axios.get(`${url}/start-offer-ride`, {
      params: {
        id: driverOrderId,
        otp,
      },
    });
  } catch (error) {
    if (error?.response?.data?.msg === "Invalid OTP") {
      return ToastAndroid.show("Invalid OTP", ToastAndroid.SHORT);
    }
    console.log(error);
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
