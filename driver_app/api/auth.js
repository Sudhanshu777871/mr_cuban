import axios from "axios";
import { ToastAndroid } from "react-native";

// let url = "https://mr-cuban-app-backend.onrender.com/api/v1";
let url = "https://mrcuban-dashboard-backend.onrender.com/api/v1"


export const LoginApi = async (email, password) => {
  try {
    return await axios.post(
      `${url}/driver/login`,
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
    console.log(error?.response?.data?.msg);
    ToastAndroid.show(error?.response?.data?.msg, ToastAndroid.SHORT);

  }
};

export const RegisterApi = async (name, email, phone, password,dl) => {
  try {
    return await axios.post(`${url}/register/driver`, {
      name,
      email,
      phone,
      password,
      dl
    });
  } catch (error) {
    // console.log(error);
    ToastAndroid.show(error?.response?.data?.msg, ToastAndroid.SHORT);

  }
};

export const LoadApi = async (token) => {
  try {
    return await axios.get(`${url}/driver/load`, {
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
    return await axios.get(`${url}/driver/forgot`, {
      params: { email },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const ResetPasswordAPI = async (email, password, otp) => {
  try {
    return await axios.get(`${url}/driver/verify`, {
      params: { email, password, otp },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const UpdateUserApi = async (name, password, phone, id, token) => {
  try {
    return await axios.post(
      `${url}/driver/update`,
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
