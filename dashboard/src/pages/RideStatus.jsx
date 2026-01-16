import { Popover } from "antd";
import React, { useEffect, useState } from "react";
import { RideStatusAPI } from "../api/api";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocation, useSearchParams } from "react-router-dom";

const content = (d) => (
  <div className="pop">
    <h2>{d?.name}</h2>
    <div className="rating-wrap">
      <p className="star">
        <i className="bx bxs-star"></i>
        {d?.rating}
      </p>
      <p className="user">
        <i className="bx bx-user"></i>
        {d?.model.seat} seater
      </p>
      <p className="order">
        <i className="bx bxs-car"></i>
        {d?.orders}+
      </p>
    </div>

    <p className="text">Model Name: {d?.model?.model}</p>
    <p className="text">Model Number: {d?.model?.modelNumber}</p>
    <p className="text">Phone Number: {d?.phone}</p>
    <img src={d?.model?.modelImage[0]?.url} />
  </div>
);

const RideStatus = () => {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const param = useLocation();

  const FetchRecords = async (id) => {
    try {
        if(id==="") return
      setLoading(true);
      const result = await RideStatusAPI(id);
      if (result?.data?.data) {
        if (result?.data?.status === "Lead") {
          setStatus("Lead");
        } else {
          setStatus("Order");
        }
        setState(result?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id !== "") {
      FetchRecords(id);
    }
  }, []);

  useEffect(() => {
    if (location?.search) {
      setId(location?.search?.split("?q=")[1]);
    }
  }, [location?.search]);

  return (
    <section className="ride_status">
      <h1>
      <i className='bx bxs-shield-alt-2' ></i>Ride Status
      </h1>

      <div className="searchbar">
        <input
          onChange={(e) => setId(e.target.value)}
          value={id}
          type="text"
          placeholder="Search by Customer Id"
        />
        <button onClick={() => FetchRecords(id)} disabled={loading}>
          {loading ? <LoadingOutlined /> : "Search"}
        </button>
      </div>

      {state?.hasOwnProperty("customerOrder") && state?.customerOrder && (
        <div className="ride_ifo">
          <h2>Customer Info</h2>
          <div className="form-wrap">
            <div className="form-group">
              <label>Customer Name</label>
              <h4>{state?.customer?.name}</h4>
            </div>
            <div className="form-group">
              <label>Customer Email</label>
              <h4>
                <a
                  href="mailto:${email}?subject=Inquiry&body=Hello, 
                I would like to know more about your services."
                >
                  {state?.customer?.email}
                </a>
              </h4>
            </div>
            <div className="form-group">
              <label>Customer Phone</label>
              <h4>
                <a href={`tel:${state?.customer?.phone}`}>
                  {state?.customer?.phone}{" "}
                </a>
              </h4>
            </div>
          </div>
        </div>
      )}
      {status === "Lead" ? (
        <LeadOrder state={state} />
      ) : (
        <CustomerOrder state={state} />
      )}
    </section>
  );
};

export default RideStatus;

export const CustomerOrder = ({ state }) => {
  return (
    state?.hasOwnProperty("customerOrder") &&
    state?.customerOrder && (
      <div className="ride_ifo">
        <h2>Customer Order Details</h2>
        <div className="form-wrap">
          <div className="form-group">
            <label>Pickup Address</label>
            <h4>{state?.customerOrder?.distance1}</h4>
          </div>
          <div className="form-group">
            <label>Drop Address</label>
            <h4>{state?.customerOrder?.distance2}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Return Pickup Address</label>
            <h4>{state?.customerOrder?.distance3}</h4>
          </div>
          <div className="form-group">
            <label>Return Drop Address</label>
            <h4>{state?.customerOrder?.distance4}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Pickup Date & Time</label>
            <h4>{state?.customerOrder?.date1}</h4>
          </div>
          <div className="form-group">
            <label>Return Date & Time</label>
            <h4>{state?.customerOrder?.date2}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Vichel Type</label>
            <h4>{state?.customerOrder?.seater} Seater</h4>
          </div>
          <div className="form-group">
            <label>Total Distance</label>
            <h4>{state?.customerOrder?.km}KM</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Total Amount</label>
            <h4>₹{state?.customerOrder?.price}</h4>
          </div>
          <div className="form-group">
            <label>Ride Type</label>
            <h4>{state?.customerOrder?.type}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Order Creation Time</label>
            <h4>{new Date(state?.customerOrder?.createdAt)?.toString()}</h4>
          </div>
          <div className="form-group">
            <label>Status</label>
            <h4 className={`status ${state?.customerOrder?.status}`}>
              {state?.customerOrder?.status}
            </h4>
          </div>
        </div>
        <div className="form-wrap2">
          <label>Drivers</label>
          <div className="driver-map">
            {state?.customerOrder?.driver?.map((d) => (
              <Popover
                overlayInnerStyle={{
                  background: "rgba(255,255,255,0.4)",
                  padding: "0.5rem",
                  backdropFilter: "blur(2px)",
                  width: "200px",
                }}
                key={d?.id}
                content={content(d)}
              >
                <div
                  className={
                    d.id === state?.customerOrder?.driverOrderId
                      ? "driver-card active"
                      : "driver-card"
                  }
                >
                  <i className="bx bxs-car"></i>
                  <p>
                    <span className="name">{d?.name}</span>
                    <span>₹{d?.price}</span>
                  </p>
                  <p style={{ textTransform: "capitalize" }}>
                    {d?.model?.model}
                  </p>
                  <p>{d?.model?.modelNumber}</p>
                </div>
              </Popover>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export const LeadOrder = ({ state }) => {
  return (
    state?.hasOwnProperty("customerOrder") &&
    state?.customerOrder && (
      <div className="ride_ifo">
        <h2>Lead Order Details</h2>
        <div className="form-wrap">
          <div className="form-group">
            <label>Pickup Address</label>
            <h4>{state?.customerOrder?.pickup_address}</h4>
          </div>
          <div className="form-group">
            <label>Drop Address</label>
            <h4>{state?.customerOrder?.drop_address}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Return Pickup Address</label>
            <h4>{state?.customerOrder?.return_pickup_address}</h4>
          </div>
          <div className="form-group">
            <label>Return Drop Address</label>
            <h4>{state?.customerOrder?.return_drop_address}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Pickup Date & Time</label>
            <h4>{state?.customerOrder?.pickup_date}</h4>
          </div>
          <div className="form-group">
            <label>Return Date & Time</label>
            <h4>{state?.customerOrder?.return_date}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Vichel Type</label>
            <h4>{state?.customerOrder?.seater} Seater</h4>
          </div>
          <div className="form-group">
            <label>Total Distance</label>
            <h4>{state?.customerOrder?.distance}KM</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Total Amount</label>
            <h4>₹{state?.customerOrder?.price || 0}</h4>
          </div>
          <div className="form-group">
            <label>Ride Type</label>
            <h4>{state?.customerOrder?.trip_type}</h4>
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Order Creation Time</label>
            <h4>{new Date(state?.customerOrder?.createdAt)?.toString()}</h4>
          </div>
          <div className="form-group">
            <label>Status</label>
            <h4 className={`status ${state?.customerOrder?.status}`}>
              {state?.customerOrder?.status}
            </h4>
          </div>
        </div>
        <div className="form-wrap2">
          <label>Drivers</label>
          <div className="driver-map">
            {state?.customerOrder?.drivers?.map((d) => (
              <Popover
                overlayInnerStyle={{
                  background: "rgba(255,255,255,0.4)",
                  padding: "0.5rem",
                  backdropFilter: "blur(2px)",
                  width: "200px",
                }}
                key={d?.id}
                content={content(d)}
              >
                <div
                  className={
                    d.id === state?.customerOrder?.driverOrderId
                      ? "driver-card active"
                      : "driver-card"
                  }
                >
                  <i className="bx bxs-car"></i>
                  <p>
                    <span className="name">{d?.name}</span>
                    <span>₹{d?.price}</span>
                  </p>
                  <p style={{ textTransform: "capitalize" }}>
                    {d?.model?.model}
                  </p>
                  <p>{d?.model?.modelNumber}</p>
                </div>
              </Popover>
            ))}
          </div>
        </div>
      </div>
    )
  );
};
