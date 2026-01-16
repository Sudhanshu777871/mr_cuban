import axios from "axios";
import { ToastAndroid } from "react-native";

// let url = "https://mr-cuban-app-backend.onrender.com/api/v1";
let url = "https://mrcuban-dashboard-backend.onrender.com/api/v1"

export const AcceptOrderAPI = async (orderId, driverId, customerId, name) => {
  try {
    return await axios.post(`${url}/accept/lead/customer`, {
      orderId,
      driverId,
      customerId,
      name,
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const GetCurrentOrdersAPI = async (page, id) => {
  try {
    return await axios.get(`${url}/get/driver/upcoming/order`, {
      params: {
        id: id,
        page,
        limit: 10,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const GetHistoryOrdersAPI = async (page, id) => {
  try {
    return await axios.get(`${url}/get/driver/history/order`, {
      params: {
        id: id,
        page,
        limit: 10,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetRidesAPI = async (id) => {
  try {
    return await axios.get(`${url}/get/lead/drivers`, {
      params: {
        orderId: id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const GetLeads = async () => {
  try {
    return await axios.get(`${url}/leads`);
  } catch (error) {
    console.log(error);
  }
};

export const AcceptDriverOrderAPI = async (
  price,
  id,
  driverId,
  driverName,
  model,
  rating,
  orders,
  phone,img
) => {
  try {
    return await axios.post(`${url}/accept/lead/driver`, {
      price,
      id,
      driverId,
      driverName,
      model,
      rating,
      orders,
      phone,
      img
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const StartRideAPI = async (id, otp) => {
  try {
    return await axios.get(`${url}/start/ride`, { params: { id, otp } });
  } catch (error) {
    if (error?.response?.data?.msg === "Invalid OTP") {
      return ToastAndroid.show("Invalid OTP", ToastAndroid.SHORT);
    }
    console.log(error);
  }
};

export const FinishRideAPI = async (id) => {
  try {
    return await axios.get(`${url}/end/ride`, { params: { id } });
  } catch (error) {
    console.log(error?.response?.data?.msg);
  }
};
