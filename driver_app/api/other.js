import axios from "axios";

// let url = "https://mr-cuban-app-backend.onrender.com/api/v1";
let url = "https://mrcuban-dashboard-backend.onrender.com/api/v1"



export const CreateRide = async (myForm) => {
  console.log(myForm)
  try {
    return await axios.post(`${url}/create/ride`, myForm,{
      headers:{
        'Content-Type': 'multipart/form-data',

      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetRides = async (id) => {
  try {
    return await axios.get(`${url}/get/ride`, {
      params: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};


export const GetActiveRides = async (id) => {
  try {
    return await axios.get(`${url}/get/ride/active`, {
      params: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};




export const DeleteRide = async (id) => {
  try {
    return await axios.get(`${url}/delete/ride`, {
      params: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetHomeCommentsAPI = async (id) => {
  try {
    return await axios.get(`${url}/get/comment/by/driver/5`, {
      params: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const GetAllCommentsAPI = async (id) => {
  try {
    return await axios.get(`${url}/get/comment/by/driver`, {
      params: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const GetAllNotifications = async (id) => {
  try {
    return await axios.get(`${url}/get/notifications`, {
      params: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const SavedPushNotificationToken = async (id, token) => {
  try {
    return await axios.get(`${url}/save/push/token`, {
      params: {
        id: id,
        token: token,
        appType: "driver",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
