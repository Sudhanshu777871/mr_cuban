import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const API_URL = "https://mrcuban-dashboard-backend.onrender.com/api/v1/get-app-version"; // api endpoint

export const checkForAppUpdate = async () => {
  try {
    const appFor = await AsyncStorage.getItem("appFor");
    const localVersion = await AsyncStorage.getItem("appVersion");

    if (!appFor || !localVersion) {
      console.log("App info missing from storage");
      return { updateRequired: false };
    }

    const lastCheck = await AsyncStorage.getItem("lastCheckTime");
    const now = new Date();

    // --- 🕒 Check if 24 hours passed since last check ---
    if (lastCheck) {
      const diffHours = (now - new Date(lastCheck)) / (1000 * 60 * 60);
      const storedInterval = await AsyncStorage.getItem("checkIntervalHours");
      const interval = storedInterval ? Number(storedInterval) : 24;

      // If not enough time passed, skip version check
      if (diffHours < interval) {
        console.log(`⏳ Skipping check: only ${diffHours.toFixed(2)}h passed`);
        return { updateRequired: false };
      }
    }

    // --- 🌐 Call API for version list ---
    const res = await axios.get(API_URL);
    const versions = res.data?.data || [];

    // --- 🔎 Find the version for this appFor ---
    const latestVersion = versions.find(
      (v) => v.appFor === appFor && v.status === "active"
    );

    if (!latestVersion) {
      console.log("No active version found for appFor:", appFor);
      return { updateRequired: false };
    }

    // --- ⚖️ Compare versions ---
    if (latestVersion.appVersion !== localVersion) {
      console.log(
        `⚠️ New version available: ${latestVersion.appVersion} (local: ${localVersion})`
      );

      // Set next check time based on admin-configured timeToShow (in hours)
      const nextInterval = latestVersion.timeToShow || 24;
      await AsyncStorage.setItem("checkIntervalHours", nextInterval.toString());
      await AsyncStorage.setItem("lastCheckTime", now.toISOString());

      return {
        updateRequired: true,
        latestVersion,
      };
    }

    // --- ✅ Versions match, set next check for 24h by default ---
    await AsyncStorage.setItem("lastCheckTime", now.toISOString());
    await AsyncStorage.setItem("checkIntervalHours", "24");

    console.log("✅ App version up-to-date");
    return { updateRequired: false };
  } catch (err) {
    console.error("❌ Version check failed:", err);
    return { updateRequired: false };
  }
};
