import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DisableRides, FetchDriverOrdersAPI, GetRides, GetTRRatioAPI } from "../api/api";
import { Image, Pagination } from "antd";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";

const DriverDetail = () => {
  const [tab, setTab] = useState(1);
  const location = useLocation();

  return (
    <section className="detail">
      <h1>Driver Details</h1>
      <div className="tabs">
        <div className="tab">
          <div className={tab === 1 ? "tab1 active" : "tab1"} onClick={() => setTab(1)}>
            Personal Details
          </div>
          <div className={tab === 2 ? "tab1 active" : "tab1"} onClick={() => setTab(2)}>
            Order Details
          </div>
          <div className={tab === 3 ? "tab1 active" : "tab1"} onClick={() => setTab(3)}>
            TR Ratio
          </div>
        </div>
        <div className="tab-content">
          {tab === 1 && <div className="detailContent"><PersonalDetails location={location} /></div>}
          {tab === 2 && <div className="detailContent"><OrderDetails location={location} /></div>}
          {tab === 3 && <div className="detailContent"><TRRatioDetails location={location} /></div>}
        </div>
      </div>
    </section>
  );
};

export default DriverDetail;

export const PersonalDetails = ({ location }) => {
  const { name, email, phone, orders, ratings, dl, createdAt, verify } = location.state;
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const DisableRidesfun = async (id, status) => {
    try {
      if (window.confirm("Are you sure you want to update the vichele status?")) {
        setLoading2(true);
        const result = await DisableRides(id, status);
        if (result?.data?.data) {
          toast.success("Vichele Status Update Successfully");
          getRides();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const getRides = async () => {
    try {
      setLoading(true);
      const result = await GetRides(location?.state?._id);
      if (result?.data?.data) {
        setState(result?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location?.state?._id) {
      getRides();
    }
  }, [location?._id]);

  return (
    <>
      <div className="forms">
        <div className="form-wrap">
          <div className="form-group">
            <label>Name</label>
            <input type="text" disabled value={name} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="text" disabled value={email} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" disabled value={phone} />
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Total Orders</label>
            <input type="text" disabled value={orders} />
          </div>
          <div className="form-group">
            <label>Total Ratings</label>
            <input type="text" disabled value={ratings} />
          </div>
          <div className="form-group">
            <label>Driving License</label>
            <input type="text" disabled value={dl} />
          </div>
        </div>
        <div className="form-wrap">
          <div className="form-group">
            <label>Account Registration Date</label>
            <input type="text" disabled value={new Date(createdAt).toLocaleString()} />
          </div>
          <div className="form-group">
            <label>Account Status</label>
            <input type="text" disabled value={verify ? "Verified" : "Unverified"} />
          </div>
        </div>
      </div>
      <p>Vichele Details</p>
      {state?.map((d) => (
        <div className="vicheles">
          <div className="vichele-card">
            <div className="img">
              {d?.img?.map((d2) => (
                <Image src={d2?.url} alt="img" />
              ))}
            </div>
            <h5>{d?.modelName}</h5>
            <p>{d?.modelNumber}</p>
            <button
              disabled={loading2}
              onClick={() => DisableRidesfun(d?._id, d?.status === true ? false : true)}
            >
              {loading2 ? <LoadingOutlined /> : Boolean(d?.status) === true ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export const OrderDetails = ({ location }) => {
  const { _id } = location.state;
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const GetRecords = async () => {
    try {
      setLoading(true);
      const result = await FetchDriverOrdersAPI(_id, current);
      if (result?.data?.data) {
        setState(result?.data?.data);
        setTotal(result?.data?.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) GetRecords();
  }, [location, current]);

  return (
    <>
      <p>Display {state?.length} out of {total} records.</p>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Customer Details</th>
              <th>Order Details</th>
              <th style={{ width: "100px" }}>Price</th>
              <th style={{ width: "100px" }}>Status</th>
              <th style={{ width: "150px" }}>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {state?.map((d) => (
              <tr>
                <td>
                  <p>Customer Name: {d?.customerDetails?.name}</p>
                  <p>Email Address: {d?.customerDetails?.email}</p>
                  <p>Phone Number: {d?.customerDetails?.phone}</p>
                </td>
                <td>
                  <p>Pickup Address: {d?.distance1}</p>
                  <p>Drop Address: {d?.distance2}</p>
                  <p>Trip Type: {d?.type}</p>
                  <p>Pickup Date: {d?.date1}</p>
                  <p>Return Date: {d?.date2}</p>
                </td>
                <td>₹{d?.price}</td>
                <td>{d?.status}</td>
                <td>{d?.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 10 && !loading && (
        <div className="page" style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Pagination total={total} onChange={setCurrent} current={current} />
        </div>
      )}
    </>
  );
};

export const TRRatioDetails = ({ location }) => {
  const { _id } = location.state;
  const [trData, setTrData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTRRatio = async () => {
    try {
      setLoading(true);
      const result = await GetTRRatioAPI(_id);
      if (result?.data) {
        setTrData(result.data);
      }
    } catch (error) {
      console.log("Error fetching TR Ratio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (_id) getTRRatio();
  }, [_id]);

  return (
    <div className="forms">
      {loading ? (
        <LoadingOutlined />
      ) : trData ? (
        <>
          <div className="form-wrap">
            <div className="form-group">
              <label>Total Customers</label>
              <input type="text" disabled value={trData.totalCustomers} />
            </div>
            <div className="form-group">
              <label>Returning Customers</label>
              <input type="text" disabled value={trData.returningCustomers} />
            </div>
            <div className="form-group">
              <label>TR Ratio</label>
              <input type="text" disabled value={trData.trRatio} />
            </div>
          </div>
        </>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};
