import axios from "axios";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_APP_BASE_URL;
const localURL = import.meta.env.VITE_APP_BASE_FORNTEND_URL;

export const FetchDrivers = async (current) => {
  try {
    console.log(url);
    return await axios.get(`${url}/admin/driver`, {
      params: {
        page: current,
        limit: 10,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const FetchUsers = async (current) => {
  try {
    console.log(url);
    return await axios.get(`${url}/admin/users`, {
      params: {
        page: current,
        limit: 20,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateDrivers = async (id) => {
  try {
    console.log(url);
    return await axios.get(`${url}/admin/driver/update`, {
      params: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const LoginAPI = async (email, password) => {
  try {
    return await axios.get(`${url}/admin/login`, {
      params: {
        email,
        password,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const CreateVicheleAPI = async (name, seat,type) => {
  try {
    return await axios.get(`${url}/create/vichele`, {
      params: {
        name,
        seat,
        type
      },
    });
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg);
  }
};

export const FetchVicheleAPI = async () => {
  try {
    return await axios.get(`${url}/vichele`, {
      params: {},
    });
  } catch (error) {
    console.log(error);
  }
};

export const DeeleteVichele = async (id) => {
  try {
    return await axios.get(`${url}/delete/vichele`, {
      params: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const FetchDriverOrdersAPI = async (id, current) => {
  try {
    return await axios.get(`${url}/admin/driver/orders`, {
      params: {
        id,
        page: current,
        limit: 10,
      },
    });
  } catch (error) {
    console.log(error);
  }
};


export const FetchUserOrdersAPI = async (id, current) => {
    try {
      return await axios.get(`${url}/admin/user/orders`, {
        params: {
          id,
          page: current,
          limit: 10,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };


  export const GetRides = async (id) => {
    try {
      return await axios.get(`${url}/get/ride`, {
        params: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };





  export const DisableRides = async (id,status) => {
    try {
      return await axios.get(`${url}/get/ride/disable`, {
        params: {
          id,status
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  export const RideStatusAPI = async (id) => {
    try {
      return await axios.get(`${url}/ride/status`, {
        params: {
          id
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg?.includes("Object") ? "Invaild Customer ID"
      :(error?.response?.data?.msg))
    }
  };


  // api endpoint for fetching the TR ratio of driver

export const GetTRRatioAPI = async (driverId) => {
  try {
    const response = await axios.get(`${localURL}/tr-ratio/${driverId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// api endpoint for show all comments which is not approved yet


export const showNotApprovedCommentByDriver=async()=>{
  try {
    const response = await axios.get(`${localURL}/get/comment/all/driver`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// function for update the driver rating by admin given 
export const updateDriverRating = async (id, payload) => {
  try {
    const response = await axios.put(`${localURL}/update/rating/${id}`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// -------------------- New API: Create App Version --------------------
export const CreateAppVersionAPI = async (
  appFor,
  appVersion,
  apkUrl,
  appMsg,
  timeToShow
) => {
  try {
    return await axios.post(`${localURL}/create-app-version`, {
      appFor,
      appVersion,
      apkUrl,
      appMsg,
      timeToShow,
    });
  } catch (error) {
    console.error("CreateAppVersionAPI Error:", error);
    toast.error(error?.response?.data?.message || "Failed to create version");
    throw error;
  }
};

// -------------------- New API: Fetch Current Rides --------------------
export const FetchCurrentRidesAPI = async (current) => {
  try {
    return await axios.get(`${url}/admin/current-rides`, {
      params: {
        page: current,
        limit: 20,
      },
    });
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg || "Failed to fetch current rides");
    throw error;
  }
};

// -------------------- Notification APIs --------------------
export const SendBroadcastNotificationAPI = async (title, message, sentTo, notificationType) => {
  try {
    return await axios.post(`${url}/admin/send-notification`, {
      title,
      message,
      sentTo,
      notificationType,
    });
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg || "Failed to send notification");
    throw error;
  }
};

export const FetchNotificationHistoryAPI = async (current) => {
  try {
    return await axios.get(`${url}/admin/notification-history`, {
      params: {
        page: current,
        limit: 20,
      },
    });
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg || "Failed to fetch notification history");
    throw error;
  }
};

export const FetchNotificationStatsAPI = async () => {
  try {
    return await axios.get(`${url}/admin/notification-stats`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
