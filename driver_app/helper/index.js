import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const addAddress = async (name, pickup) => {
  try {
    // Get existing addresses from AsyncStorage
    let temp = await AsyncStorage.getItem(name); // Await for AsyncStorage to get the item
    let addresses = temp ? JSON.parse(temp) : [];

    // Check if the pickup address is already in the list
    if (!addresses.includes(pickup)) {
      // Limit the address list to 5 entries
      const maxAddresses = 5;

      // Remove pickup if it exists
      addresses = addresses.filter(address => address !== pickup);

      // Add pickup to the start of the list
      addresses.unshift(pickup);

      // Trim the list to maxAddresses
      addresses = addresses.slice(0, maxAddresses);

      // Update AsyncStorage with the modified addresses array
      await AsyncStorage.setItem(name, JSON.stringify(addresses)); // Await for AsyncStorage to set the item
    }
  } catch (error) {
    console.error('Error adding address:', error.message);
    // Optionally handle or log the error here
  }
};







export function timeAgo(createdAt) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(createdAt)) / 1000); // Calculate difference in seconds

  // Determine time ago string based on difference
  if (diffInSeconds < 5) {
      return "Just now";
  } else if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
  } else if (diffInSeconds < 3600) { // Less than 1 hour
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
  } else if (diffInSeconds < 86400) { // Less than 1 day
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hr ago`;
  } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day ago`;
  }
}




async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "New Order Placed",
    body: "Get the ride",
    data: { someData: "goes here" },
    vibrate:true
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}