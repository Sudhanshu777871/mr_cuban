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
