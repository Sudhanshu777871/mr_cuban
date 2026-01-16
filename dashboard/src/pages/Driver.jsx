import React, { useEffect, useState } from "react";
import { FetchDrivers, GetTRRatioAPI, updateDrivers } from "../api/api";
import { Pagination, Tooltip } from "antd";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Driver = () => {
  const [state, setState] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [trRatios, setTrRatios] = useState({});
  const Navigate = useNavigate();

  const getREcords = async () => {
    try {
      setLoading(true);
      const result = await FetchDrivers(current);
      if (result?.data?.data) {
        const drivers = result.data.data;
        setState(drivers);
        setTotal(result.data.total);

        // Fetch TR Ratio for each driver
        const trRatioData = {};
        await Promise.all(
          drivers.map(async (driver) => {
            try {
              const ratioResponse = await GetTRRatioAPI(driver._id);
              // ✅ Store only the TR Ratio value (not the full object)
              trRatioData[driver._id] = ratioResponse?.data?.trRatio ?? "N/A";
            } catch (err) {
              trRatioData[driver._id] = "Error";
            }
          })
        );
        setTrRatios(trRatioData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const StatusUpdate = async (id) => {
    try {
      setLoading(true);
      const result = await updateDrivers(id);
      if (result?.data?.data) {
        toast.success("Account Update Successfully");
        getREcords();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getREcords();
  }, [current]);

  return (
    <section className="driver">
      <h1>
        <i className="bx bxs-user-voice"></i>Driver Records
      </h1>
      <p>
        Display {state?.length} out of {total} Records
      </p>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registration Date</th>
              <th>Account Status</th>
              <th>TR Ratio</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                <tr key={index}>
                  {[...Array(7)].map((_, i) => (
                    <td key={i} style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                  ))}
                </tr>
              ))
              : state?.map((d) => (
                <tr key={d?._id}>
                  <td
                    onClick={() =>
                      Navigate(`/driver/${d?._id}`, { state: d })
                    }
                    style={{ cursor:"pointer" }}
                  >
                    {d?.name}
                  </td>
                  <td>
                    <Tooltip placement="top" title={d?.email}>
                      {d?.email}
                    </Tooltip>
                  </td>
                  <td>{d?.phone}</td>
                  <td>{new Date(d?.createdAt).toLocaleString()}</td>
                  <td>
                    <span className="status">
                      {d?.verify === false ? "Unverified" : "Verified"}
                    </span>
                  </td>
                  <td>
                    {trRatios[d._id] !== undefined ? trRatios[d._id] : (
                      <LoadingOutlined />
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => StatusUpdate(d?._id)}
                      className={d?.verify === false ? "blue" : "red"}
                    >
                      {d?.verify === false ? "Enable" : "Disable"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {total > 10 && !loading && (
        <center
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Pagination total={total} onChange={setCurrent} current={current} />
        </center>
      )}
    </section>
  );
};

export default Driver;
