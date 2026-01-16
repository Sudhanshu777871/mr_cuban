import axios from "axios";

let url = "https://autocomplete.search.hereapi.com/v1/autocomplete";

export const AddressSuggestions = async (q) => {
  try {
    
    return await axios.get(`${url}`, {
      params: {
        q: q,
        in: "countryCode:IND",
        limit: 5,
        // types:'area',
        apiKey: "vhbIdgHgrzlGkDBj8EYvL_nN3pZJc_ozWkShWQP3FCc",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
