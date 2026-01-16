import axios from "axios";

//Dev Backend
// let url = "https://mr-cuban-app-backend.onrender.com/api/v1";
//Production Backend
let url = "https://mrcuban-dashboard-backend.onrender.com/api/v1"

export const CreateOrder = async (
  pickup,
  drop,
  returnPickup,
  returnDrop,
  pickdate,
  dropdate,
  type,
  id,
  otp,
  taxi,
  km
) => {
  try {
    return await axios.post(
      `${url}/create/lead`,
      {
        pickup,
        drop,
        type,
        returnPickup: drop,
        returnDrop: pickup,
        pickdate,
        dropdate,
        id,
        otp,
        seat: taxi,
        km,
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


// route for negotiation 
export const CustomerNegotiationAPI = async (
  id,
  driverId,
  price
) => {
  try {
    return await axios.post(`${url}/create/negotiation`, {
      id,
      driverId,
      price
    });
  } catch (error) {
    console.log(error?.response);
  }
};



export const CustomerNegotiationAPIGlobal = async (
  price,
  id
) => {
  try {
    return await axios.post(`${url}/create/negotiation/global`, {
      price,
      id
    });
  } catch (error) {
    console.log(error?.response);
  }
};


export const SearchOrders = async (id, token) => {
  try {
    console.log(id,"1")
    return await axios.get(`${url}/get/lead`, {
      params: {
        id: id,
      },
      headers: {
        token,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const CancelOrderAPI = async (id) => {
  try {
    console.log(id);
    return await axios.get(`${url}/cancel/lead/customer`, {
      params: {
        id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const CancelOrderAfterAPI = async (coi, doi) => {
  try {
    return await axios.get(`${url}/cancel/lead/customer/after`, {
      params: {
        coi,
        doi,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const AcceptOrderAPI = async (orderId, driverId, customerId, name,selectedPrice) => {
  try {
    return await axios.post(`${url}/accept/lead/customer`, {
      orderId,
      driverId,
      customerId,
      name,
      selectedPrice
    });
  } catch (error) {
    console.log(error?.response);
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

export const GetCurrentOrdersAPI = async (page, id) => {
  try {
    return await axios.get(`${url}/get/customer/upcoming/order`, {
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
    return await axios.get(`${url}/get/customer/history/order`, {
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

export const SendPushNotification = async (title, message, seat) => {
  try {
    return await axios.get(`${url}/send/push/notification`, {
      params: {
        title,
        message,
        seat,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const createCommentAPI = async (
  driverId,
  customerId,
  comment,
  rating
) => {
  try {
    return await axios.get(`${url}/create/comment`, {
      params: {
        driverId,
        customerId,
        comment,
        rating,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const GetCommentAPI = async (id) => {
  try {
    return await axios.get(`${url}/get/comment/by/user`, {
      params: {
        id,
      },
    });
  } catch (error) {
    console.log(error?.response);
  }
};

export const GetVicheles = async () => {
  try {
    return await axios.get(`${url}/vichele`, {
      params: {},
    });
  } catch (error) {
    console.log(error?.response);
  }
};
