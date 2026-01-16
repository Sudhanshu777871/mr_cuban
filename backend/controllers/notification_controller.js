import { Expo } from "expo-server-sdk";
import { Tokens } from "../models/expo.js";
import { Notification } from "../models/notification.js";
import { User } from "../models/user.js";
import { Driver } from "../models/driver.js";

export const getNotifications = async (req, res) => {
    try {
      const { id } = req.query;

      // Calculate the date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 3);

      // Delete notifications older than 7 days for the given driverId
      await Notification.deleteMany({
        driverId: id,
        createdAt: { $lte: sevenDaysAgo },
      });

      // Fetch all the notifications for the driver
      const data = await Notification.find({ driverId: id }).sort({createdAt:-1});

      return res.status(200).json({ msg: "Notifications retrieved successfully", data });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  };

// Send notification to all customers, drivers, or both
export const SendBroadcastNotification = async (req, res) => {
  try {
    const { title, message, sentTo, notificationType } = req.body;

    if (!title || !message || !sentTo) {
      return res.status(400).json({
        msg: "Title, message, and sentTo (customer/driver/both) are required"
      });
    }

    const expo = new Expo();
    let tokens = [];
    let recipientCount = 0;

    // Fetch tokens based on sentTo value
    if (sentTo === "customer") {
      tokens = await Tokens.find({
        $or: [
          { appType: "customer" },
          { appType: { $exists: false } },
          { appType: null }
        ]
      });
    } else if (sentTo === "driver") {
      tokens = await Tokens.find({ appType: "driver" });
    } else if (sentTo === "both") {
      tokens = await Tokens.find({});
    }

    recipientCount = tokens.length;

    if (!tokens.length) {
      return res.status(400).json({
        msg: "No recipients found",
        recipientCount: 0
      });
    }

    // Save notification to database
    const notificationRecord = await Notification.create({
      title,
      message,
      sentTo,
      sentBy: "admin",
      recipientCount,
      notificationType: notificationType || "other"
    });

    // Send response immediately
    res.status(200).json({
      msg: "Notification is being sent",
      recipientCount,
      notificationId: notificationRecord._id
    });

    // Send notifications in background
    (async () => {
      let successCount = 0;
      let failCount = 0;

      for (let tokenData of tokens) {
        if (!tokenData.token || !Expo.isExpoPushToken(tokenData.token)) {
          console.error(`Invalid push token: ${tokenData?.token}`);
          failCount++;
          continue;
        }

        const notification = {
          to: tokenData.token,
          sound: "default",
          title,
          body: message,
          data: {
            type: "admin_notification",
            notificationType: notificationType || "other"
          },
          priority: "high",
          channelId: "default",
        };

        try {
          await expo.sendPushNotificationsAsync([notification]);
          successCount++;
        } catch (error) {
          console.error(`Error sending to ${tokenData.token}:`, error.message);
          failCount++;
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      console.log(`Broadcast complete: ${successCount} successful, ${failCount} failed`);
    })().catch(error => {
      console.error("Background notification error:", error);
    });

  } catch (error) {
    console.error("Error in SendBroadcastNotification:", error);
    res.status(500).json({
      msg: error.message || "Error sending notification"
    });
  }
};

// Fetch notification history
export const FetchNotificationHistory = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;
    const skip = (pageNo - 1) * pageSize;

    // Only fetch admin notifications (exclude driver-specific ones)
    const total = await Notification.countDocuments({
      sentBy: "admin",
      sentTo: { $exists: true, $ne: null }
    });

    const notifications = await Notification.find({
      sentBy: "admin",
      sentTo: { $exists: true, $ne: null }
    })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skip)
      .lean();

    return res.status(200).json({
      msg: "success",
      data: notifications,
      total
    });
  } catch (error) {
    console.error("Error fetching notification history:", error);
    res.status(400).json({
      msg: error.message || "Error fetching notifications"
    });
  }
};

// Get notification statistics
export const GetNotificationStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    const totalDrivers = await Driver.countDocuments();

    const customerTokens = await Tokens.countDocuments({
      $or: [
        { appType: "customer" },
        { appType: { $exists: false } },
        { appType: null }
      ]
    });

    const driverTokens = await Tokens.countDocuments({ appType: "driver" });

    const totalNotifications = await Notification.countDocuments({
      sentBy: "admin",
      sentTo: { $exists: true, $ne: null }
    });

    return res.status(200).json({
      msg: "success",
      data: {
        totalCustomers,
        totalDrivers,
        customerTokens,
        driverTokens,
        totalNotifications
      }
    });
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    res.status(400).json({
      msg: error.message || "Error fetching stats"
    });
  }
};

