import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FetchDriverOrdersAPI, FetchUserOrdersAPI, GetRides } from "../api/api";
import { Pagination } from "antd";

const UserDetail = () => {
  const [tab, setTab] = useState(1);
  const [current, setCurrent] = useState(1);

  const location = useLocation();

  return (
    <section className="detail">
      <h1>User Details</h1>
      <div className="tabs">
        <div className="tab">
          <div
            className={tab === 1 ? "tab1 active" : "tab1"}
            onClick={() => setTab(1)}
          >
            Personal Details
          </div>
          <div
            className={tab === 2 ? "tab1 active" : "tab1"}
            onClick={() => setTab(2)}
          >
            Order Details
          </div>
        </div>
        <div className="tab-content">
          {tab === 1 ? (
            <div className="detailContent">
              <PersonalDetails location={location} />
            </div>
          ) : (
            <div className="detailContent">
              <OrderDetails location={location} current={current} setCurrent={setCurrent} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserDetail;

export const PersonalDetails = ({ location }) => {
  const { name, email, phone, accountOtp, createdAt, verify } = location.state;

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
            <label>Account Registration Date</label>
            <input
              type="text"
              disabled
              value={new Date(createdAt).toLocaleString()}
            />
          </div>
          <div className="form-group">
            <label>Account Status</label>
            <input
              type="text"
              disabled
              value={verify ? "Verified" : "Unverified"}
            />
          </div>

          <div className="form-group">
            <label>Account OTP</label>
            <input type="text" disabled value={accountOtp} />
          </div>
        </div>
      </div>
    </>
  );
};

export const OrderDetails = ({ location,current,setCurrent }) => {
  const { _id } = location.state;

  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const GetRecords = async () => {
    try {
      setLoading(true);
      const result = await FetchUserOrdersAPI(_id, current);
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
    if (_id) GetRecords();
  }, [_id, current]);

  return (
    <>
      <p>
        Display {state?.length} out of {total} records.
      </p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: "150px" }}>Driver Details</th>
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
                  <p>Name: {d?.driver[0]?.name}</p>
                  <p>
                    Model: {d?.driver[0]?.model?.model} (
                    {d?.driver[0]?.model?.modelNumber})
                  </p>
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
      {total > 10 && loading === false && (
        <div
          className="page"
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pagination total={total} onChange={setCurrent} current={current} />
        </div>
      )}
    </>
  );
};
