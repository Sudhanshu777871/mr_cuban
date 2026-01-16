import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    driverId: String,
    // New fields for admin notifications
    sentTo: {
        type: String,
        enum: ["customer", "driver", "both"],
        default: null
    },
    sentBy: {
        type: String,
        default: "admin"
    },
    recipientCount: {
        type: Number,
        default: 0
    },
    notificationType: {
        type: String,
        enum: ["offer", "welcome", "festival", "announcement", "other"],
        default: "other"
    }
}, { timestamps: true });



export const Notification = mongoose.model("Notifications", notificationSchema);