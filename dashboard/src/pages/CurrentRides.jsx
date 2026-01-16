import React, { useEffect, useState } from "react";
import { FetchCurrentRidesAPI } from "../api/api";
import { Pagination, Tooltip, Tag, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const CurrentRides = () => {
  const [state, setState] = useState([]);
  const [allRides, setAllRides] = useState([]); // Store all rides
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // Filter state

  const getRecords = async () => {
    try {
      setLoading(true);
      const result = await FetchCurrentRidesAPI(current);
      if (result?.data?.data) {
        setAllRides(result?.data?.data); // Store all rides
        setTotal(result?.data?.total);

        // Apply filter
        applyFilter(result?.data?.data, statusFilter);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (rides, filter) => {
    if (filter === "all") {
      setState(rides);
    } else {
      const filtered = rides.filter(ride => ride.status === filter);
      setState(filtered);
    }
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    applyFilter(allRides, value);
  };

  useEffect(() => {
    getRecords();
  }, [current]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const renderNegotiatedDrivers = (drivers) => {
    if (!drivers || drivers.length === 0) return "No negotiations";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {drivers.map((driver, index) => (
          <span key={index} style={{ fontSize: "12px" }}>
            {driver.name} - ₹{driver.price}
          </span>
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "accept":
        return "blue";
      case "start":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <section className="driver">
      <h1>
        <i className="bx bxs-car"></i> Current Rides
      </h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <p style={{ margin: 0 }}>
          Display {state?.length} out of {total} Records
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontWeight: "500" }}>Filter by Status:</label>
          <Select
            value={statusFilter}
            onChange={handleFilterChange}
            style={{ width: 150 }}
            size="large"
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="accept">Accepted</Option>
            <Option value="start">Started</Option>
          </Select>
        </div>
      </div>

      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Ride From</th>
              <th>Ride To</th>
              <th>Pickup Date</th>
              <th>Status</th>
              <th>Negotiated Drivers</th>
              <th>Assigned Driver</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [1, 2, 3, 4, 5]?.map((d, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <LoadingOutlined />
                    </td>
                  </tr>
                ))
              : state?.map((ride) => (
                  <tr key={ride?.orderId}>
                    <td>
                      <Tooltip placement="top" title={ride?.orderId}>
                        {ride?.orderId?.substring(0, 8)}...
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip placement="top" title={ride?.customerId}>
                        {ride?.customerId?.substring(0, 8)}...
                      </Tooltip>
                    </td>
                    <td>{ride?.customerName}</td>
                    <td>
                      <a href={`tel:${ride?.customerPhone}`}>
                        {ride?.customerPhone}
                      </a>
                    </td>
                    <td>
                      <Tooltip placement="top" title={ride?.rideFrom}>
                        {ride?.rideFrom?.substring(0, 30)}
                        {ride?.rideFrom?.length > 30 ? "..." : ""}
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip placement="top" title={ride?.rideTo}>
                        {ride?.rideTo?.substring(0, 30)}
                        {ride?.rideTo?.length > 30 ? "..." : ""}
                      </Tooltip>
                    </td>
                    <td>{formatDateTime(ride?.pickupDate)}</td>
                    <td>
                      <Tag color={getStatusColor(ride?.status)}>
                        {ride?.status?.toUpperCase()}
                      </Tag>
                    </td>
                    <td style={{ minWidth: "150px" }}>
                      {renderNegotiatedDrivers(ride?.negotiatedDrivers)}
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      {ride?.assignedDriver ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            {ride?.assignedDriver?.driverName}
                          </span>
                          <span style={{ fontSize: "12px" }}>
                            <a href={`tel:${ride?.assignedDriver?.driverPhone}`}>
                              {ride?.assignedDriver?.driverPhone}
                            </a>
                          </span>
                          <span style={{ fontSize: "12px", color: "#1890ff" }}>
                            Amount: ₹{ride?.assignedDriver?.rideAmount}
                          </span>
                          <Tooltip placement="top" title={ride?.assignedDriver?.driverId}>
                            <span style={{ fontSize: "11px", color: "#999" }}>
                              ID: {ride?.assignedDriver?.driverId?.substring(0, 8)}...
                            </span>
                          </Tooltip>
                        </div>
                      ) : (
                        <span style={{ color: "#999" }}>Not assigned yet</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {total > 20 && loading === false && (
        <center style={{ marginTop: "2rem" }}>
          <Pagination
            current={current}
            onChange={(page) => setCurrent(page)}
            total={total}
            pageSize={20}
          />
        </center>
      )}
    </section>
  );
};

export default CurrentRides;
