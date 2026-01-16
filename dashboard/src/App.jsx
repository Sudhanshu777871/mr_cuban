import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Driver from "./pages/Driver";
import User from "./pages/User";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Vichele from "./Vichele";
import DriverDetail from "./pages/DriverDetail";
import UserDetail from "./pages/UserDetail";
import Live from "./pages/Live";
import RideStatus from "./pages/RideStatus";
import DriverRating from "./pages/DriverRating";
import Notification from "./pages/Notification";
import AppVersion from "./pages/AppVersion";
import CurrentRides from "./pages/CurrentRides";



const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/driver/:id" element={<DriverDetail />} />

          <Route path="/user" element={<User />} />
          <Route path="/user/:id" element={<UserDetail />} />

          <Route path="/vichele" element={<Vichele />} />
          <Route path="/ride/status" element={<RideStatus />} />
          <Route path="/current-rides" element={<CurrentRides />} />
          <Route path="/driver_rating" element={<DriverRating/>}/>
          <Route path="/notification" element={<Notification/>}/>
          <Route path="/app_version" element={<AppVersion/>}/>
        </Route>
        <Route path="/live/location" element={<Live/>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
