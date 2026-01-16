import React, { useEffect, useState } from "react";
import { FetchUsers } from "../api/api";
import { Pagination, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [state, setState] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate()

  const getREcords = async () => {
    try {
      setLoading(true);
      const result = await FetchUsers(current);
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
    getREcords();
  }, [current]);

  return (
    <section className="driver">
      <h1>
        <i className="bx bxs-user-plus"></i>User Records
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
              <th>Account</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [1, 2, 3, 4, 5, 6]?.map((d) => (
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />{" "}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />{" "}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />{" "}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />{" "}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />{" "}
                    </td>
                  </tr>
                ))
              : state?.map((d) => (
                  <tr key={d?._id}>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        Navigate(`/user/${d?._id}`, { state: d })
                      }
                    >
                      {d?.name}
                    </td>
                    <td>
                      <Tooltip placement="top" title={d?.email}>
                        {d?.email}
                      </Tooltip>
                    </td>
                    <td>{d?.phone}</td>
                    <td>{new Date(d?.createdAt)?.toLocaleString()}</td>
                    <td>
                      <span className="status">Verified</span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {total > 20 && loading === false && (
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

export default User;
