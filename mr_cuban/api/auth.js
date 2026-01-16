import axios from "axios";
import { ToastAndroid } from "react-native";

//Dev Backend
// let url = "https://mr-cuban-app-backend.onrender.com/api/v1";
//Production Backend
let url = "https://mrcuban-dashboard-backend.onrender.com/api/v1"

export const LoginApi = async (email, password) => {
  try { 
    return await axios.post(
      `${url}/login/user`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const RegisterApi = async (name, email, phone, password) => {
  try {
    return await axios.post(`${url}/register/user`, {
      name,
      email,
      phone,
      password,
    });
  } catch (error) {
    console.log(error?.response?.data?.msg);
    ToastAndroid.show(error?.response?.data?.msg, ToastAndroid.SHORT);

  }
};

export const VerifyAPI = async (email, otp) => {
  try {
    return await axios.post(`${url}/verify/user`, {
      email,
      otp,
    });
  } catch (error) {
    console.log(error?.response?.data?.msg);
    ToastAndroid.show(error?.response?.data?.msg, ToastAndroid.SHORT);
  }
};

export const LoadApi = async (token) => {
  try {
    return await axios.get(`${url}/load/user`, {
      headers: {
        token,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const ForgotPasswordAPI = async (email) => {
  try {
    return await axios.get(`${url}/forgot/user`, {
      params: { email },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const ResetPasswordAPI = async (email, password, otp) => {
  try {
    return await axios.get(`${url}/reset/password/user`, {
      params: { email, password, otp },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const UpdateUserApi = async (name, password, phone, id, token) => {
  try {
    return await axios.post(
      `${url}/update/user`,
      {
        name,
        id,
        password,
        phone,
      },
      {
        headers: token,
      }
    );
  } catch (error) {
    console.log(error?.response?.data?.msg);
  }
};

export const SavedPushNotificationToken = async (id, token) => {
  try {
    return await axios.get(`${url}/save/push/token`, {
      params: {
        id,
        token,
        appType: "customer",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
