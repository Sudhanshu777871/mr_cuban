import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const location = useLocation();
  const Navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to be Logout?")) {
      localStorage.clear();
      toast.success("Logout Successfully")
      Navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      token !==
      "zxcvbnmcuban345cubanjhjfshdfjhdsf77243zssssssxzdfdf24r234q213423x2qwAWEXRXTGEXRGTERTE"
    ) {
      toast.error("Session Expire");
      Navigate("/login");
    }
  }, []);

  return (
    <section className="home">
      <div className="left">
        <div className="top">
          <h5>
            <i className="bx bxs-leaf"></i> Mr Cuban
          </h5>
        </div>
        <div className="menu-list">
          <div
            className={
              location?.pathname === "/" ? "menu-item active" : "menu-item"
            }
          >
            <i className="bx bxs-dashboard"></i>
            <Link className="link" to="/">
              Dashboard
            </Link>
          </div>
          <div
            className={
              location?.pathname === "/driver"
                ? "menu-item active"
                : "menu-item"
            }
          >
            <i className="bx bx-user-voice"></i>
            <Link to="/driver" className="link">
              Drivers
            </Link>
          </div>
          <div
            className={
              location?.pathname === "/user" ? "menu-item active" : "menu-item"
            }
          >
            <i className="bx bxs-user-plus"></i>
            <Link to="/user" className="link">
              Users
            </Link>
          </div>
          <div
            className={
              location?.pathname === "/vichele" ? "menu-item active" : "menu-item"
            }
          >
            <i className='bx bxs-car'></i>
            <Link to="/vichele" className="link">
              Vichele
            </Link>
          </div>
          <div
            className={
              location?.pathname === "/ride/status" ? "menu-item active" : "menu-item"
            }
          >
           <i className='bx bxs-shield-alt-2' ></i>
            <Link to="/ride/status" className="link">
              Ride Status
            </Link>
          </div>

          <div
            className={
              location?.pathname === "/current-rides" ? "menu-item active" : "menu-item"
            }
          >
            <i className='bx bxs-taxi'></i>
            <Link to="/current-rides" className="link">
              Current Rides
            </Link>
          </div>

          <div
            className={
              location?.pathname === "/driver_rating" ? "menu-item active" : "menu-item"
            }
          >
            <i className='bx bxs-car'></i>
            <Link to="/driver_rating" className="link">
              Driver Rating
            </Link>
          </div>


          <div
            className={
              location?.pathname === "/notification" ? "menu-item active" : "menu-item"
            }
          >
            <i className='bx bxs-bell'></i>
            <Link to="/notification" className="link">
              Manage Notifications
            </Link>
          </div>

          <div
            className={
              location?.pathname === "/app_version" ? "menu-item active" : "menu-item"
            }
          >
            <i className='bx bxs-cog'></i>
            <Link to="/app_version" className="link">
              Manage App Version
            </Link>
          </div>

          <div
            className={
              location?.pathname === "/logout"
                ? "menu-item active"
                : "menu-item"
            }
          >
            <i className="bx bx-log-out"></i>
            <span
              className="link"
              onClick={handleLogout}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
      <div className="right">
        <Outlet />
      </div>
    </section>
  );
};

export default Home;
