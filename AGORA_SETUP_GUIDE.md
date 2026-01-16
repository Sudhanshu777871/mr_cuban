# In-App Audio Calling Setup Guide

## Overview
This guide will help you set up in-app audio calling between customers and drivers using Agora RTC SDK.

## Features Implemented
✅ Audio calling between customer and driver
✅ Call button appears 30 minutes before pickup time
✅ Full-duplex communication (both can talk simultaneously)
✅ Mute/unmute functionality
✅ Speaker toggle
✅ Call duration timer
✅ Works perfectly with Expo (no CLI required)

---

## Step 1: Create Agora Account & Get Credentials

### 1.1 Sign Up for Agora
1. Go to [Agora Console](https://console.agora.io/)
2. Click "Sign Up" and create a free account
3. Verify your email

### 1.2 Create a Project
1. Log in to Agora Console
2. Click "Projects" in the left sidebar
3. Click "Create" button
4. Choose **"Create a new project"**
5. Enter project name: `MrCuban_Calls` (or any name you prefer)
6. Choose **APP ID + Token (Recommended)** for authentication
7. Click "Submit"

### 1.3 Get Your Credentials
1. Find your project in the list
2. Click the "eye" icon next to your project name
3. Copy the **App ID** - it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
4. Copy the **App Certificate** - it looks like: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

---

## Step 2: Configure Backend

### 2.1 Update Environment Variables
Open `/backend/config/.env` and update the Agora credentials:

```env
# Agora Credentials
AGORA_APP_ID = "YOUR_APP_ID_HERE"
AGORA_APP_CERTIFICATE = "YOUR_APP_CERTIFICATE_HERE"
```

Replace `YOUR_APP_ID_HERE` and `YOUR_APP_CERTIFICATE_HERE` with the credentials you copied from Agora Console.

### 2.2 Restart Backend Server
```bash
cd backend
npm start
```

The server should start without errors. Check the console - you should NOT see any Agora-related errors.

---

## Step 3: Test the Implementation

### 3.1 Create a Test Offer
1. Open **Driver App**
2. Go to **Offers** tab
3. Click the **+ button** to create a new offer
4. Set pickup time to **within 30 minutes from now** (this is important!)
5. Fill in other details and create the offer

### 3.2 Accept the Offer
1. Open **Customer App (mr_cuban)**
2. Go to **Offers** tab → **Available Offers**
3. Find and accept the newly created offer
4. Go to **My Offers** tab
5. Click on the accepted offer

### 3.3 Test the Call Feature

#### From Customer Side:
1. In the offer details screen, you should see two buttons:
   - **Call Driver** (left, enabled if within 30 mins of pickup)
   - **Cancel Ride** (right, red)
2. Click **"Call Driver"**
3. You should see a full-screen call interface with:
   - Driver's name
   - "Connecting..." status
   - Mute button
   - Speaker button
   - Red end call button

#### From Driver Side:
1. In the offer details screen, you should see two buttons:
   - **Call Customer** (left, enabled if within 30 mins of pickup)
   - **Start Ride** (right)
2. Click **"Call Customer"**
3. You should see a full-screen call interface
4. **Both apps should connect** and you can hear each other!

---

## Step 4: Test Call Features

### 4.1 Test Audio
- Speak into one device, listen on the other
- Both sides should hear each other clearly

### 4.2 Test Mute
- Click the microphone button to mute/unmute
- When muted, the other person shouldn't hear you

### 4.3 Test Speaker
- Click the speaker button to toggle speaker on/off
- Speaker mode should be louder

### 4.4 Test Call Duration
- The call timer should start counting up once connected

### 4.5 Test End Call
- Click the red button to end the call
- Both apps should return to the offer details screen

---

## Troubleshooting

### Issue 1: "Call Button is Disabled"
**Reason**: Call button is only enabled 30 minutes before pickup time.

**Solution**:
- Create an offer with pickup time set to within 30 minutes from now
- OR modify the time check in the code (for testing only):
  ```javascript
  // Change this line in both offer-detail.jsx files:
  if (minutesUntilPickup <= 30 && minutesUntilPickup >= -60) {
  // To this (for testing):
  if (minutesUntilPickup <= 1440 && minutesUntilPickup >= -60) { // 24 hours
  ```

### Issue 2: "Call Stuck on Connecting..."
**Possible Causes**:
1. Invalid Agora credentials
2. Backend server not running
3. Network issues

**Solution**:
1. Check backend console for errors
2. Verify Agora APP_ID and APP_CERTIFICATE in `.env`
3. Restart backend server
4. Check internet connection on both devices

### Issue 3: "Cannot Hear Audio"
**Solution**:
1. Check microphone permissions on both devices
2. Ensure devices are not muted
3. Try toggling speaker button
4. Check volume levels

### Issue 4: "Failed to Generate Call Token"
**Solution**:
1. Backend server must be running
2. Check `.env` file has correct Agora credentials
3. Check backend console for errors
4. Verify API endpoint is accessible

---

## How It Works

### 1. Call Initiation
```
Customer/Driver clicks "Call" button
   ↓
App sends request to backend: /api/v1/generate-token
   ↓
Backend generates Agora token using APP_ID and APP_CERTIFICATE
   ↓
Token is sent back to app
```

### 2. Channel Connection
```
App receives token
   ↓
Creates unique channel name: "offer_{offerId}"
   ↓
Both users join the same channel
   ↓
Agora connects them for audio communication
```

### 3. Call Features
- **Mute**: Stops sending audio to other user
- **Speaker**: Routes audio to speakerphone
- **End Call**: Leaves channel and releases resources

---

## Technical Details

### Files Created/Modified

#### Backend:
- `backend/controllers/agora_controller.js` - Token generation
- `backend/routes/agora_routes.js` - API routes
- `backend/index.js` - Added Agora routes
- `backend/config/.env` - Agora credentials

#### Customer App (mr_cuban):
- `mr_cuban/components/AudioCallModal.jsx` - Call UI
- `mr_cuban/api/agora.js` - API functions
- `mr_cuban/app/(offer)/offer-detail.jsx` - Added call button

#### Driver App:
- `driver_app/components/AudioCallModal.jsx` - Call UI
- `driver_app/api/agora.js` - API functions
- `driver_app/app/(offer)/offer-detail.jsx` - Added call button

### Packages Installed:
- `react-native-agora` - Agora RTC SDK for React Native
- `agora-token` - Token generation for backend

---

## Cost Information

### Agora Free Tier:
- ✅ **10,000 minutes/month FREE**
- ✅ Perfect for testing and small-scale production
- ✅ No credit card required for free tier

### Paid Plans (if you exceed free tier):
- Voice calling: ~$0.99 per 1000 minutes
- Very affordable for production use

### Monitoring Usage:
1. Log in to [Agora Console](https://console.agora.io/)
2. Go to "Usage" section
3. View real-time usage statistics

---

## Production Checklist

Before going live:

- [ ] Update `.env` with production Agora credentials
- [ ] Test calls on real devices (not just emulators)
- [ ] Test on different network conditions (WiFi, 4G, 3G)
- [ ] Monitor Agora usage to avoid exceeding free tier
- [ ] Consider implementing push notifications for incoming calls
- [ ] Add analytics to track call success rate
- [ ] Test battery consumption during calls

---

## Support

### Agora Documentation:
- [Agora React Native Quickstart](https://docs.agora.io/en/voice-calling/get-started/get-started-sdk)
- [Agora API Reference](https://api-ref.agora.io/en/voice-sdk/react-native/4.x/overview.html)

### Need Help?
1. Check Agora Console for usage and errors
2. Review backend logs for token generation issues
3. Check app logs for connection errors

---

## Success! 🎉

You should now have fully functional in-app audio calling between customers and drivers!

**Test again with a fresh offer to ensure everything works correctly.**
