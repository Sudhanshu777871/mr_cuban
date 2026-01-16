import React, { useEffect, useState } from "react";
import HereMap from "../components/Here";
import "../assets/scss/map.scss";
import { useLocation } from "react-router-dom";

const Live = () => {
  const [state, setState] = useState(false);
  const [params, setParams] = useState({});

  useEffect(() => {
    // Get the query string from the URL
    const queryString = window.location.search;

    // Create an instance of URLSearchParams
    const urlParams = new URLSearchParams(queryString);

    // Extract values from the query parameters
    const queryParams = {
      q: urlParams.get("q"),
      start: urlParams.get("start"),
      end: urlParams.get("end"),
      time: urlParams.get("time"),
      car: urlParams.get("car"),
      driverName: urlParams.get("driverName"),
      latitude: urlParams.get("latitude"),
      longitude: urlParams.get("longitude"),
      status: urlParams.get("status"),
      mobile: urlParams.get("mobile"),
    };

    // Update state with the parameters
    setParams(queryParams);
  }, []);

  

  return (
    <div className="map">
      {params?.q && <HereMap params={params} />}

      <div className="solid">
        <p>Driver Name: {params?.driverName}</p>
        <p>Driver Contact : {params?.mobile}</p>
        <p>Car Number: {params?.car}</p>

        <p>
          Status: <span>{params?.status}</span>
        </p>
        <p
          style={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => setState(!state)}
        >
          {state === false ? "More Details" : "Less Details"}{" "}
        </p>
        {state && (
          <div>
            <p>Latitude and Longitude: {params?.latitude}, {params?.longitude}</p>
            <p>Share Link Time: {params?.time}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;
