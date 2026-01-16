import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { CreateVicheleAPI, DeeleteVichele, FetchVicheleAPI } from "./api/api";
import { vicheles } from "./constants/car";

const Vichele = () => {
  const [name, setName] = useState("");
  const [seat, setSeat] = useState("");
  const [type, setType] = useState("");
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const createVichele = async () => {
    try {
      if (name === "") return toast.error("Model Name is Required");
      if (seat === "") return toast.error("Seat Count is Required");
      if (type === "") return toast.error("Type is Required");

      setLoading(true);
      const result = await CreateVicheleAPI(name, seat, type);
      if (result?.data?.data) {
        toast.success("Vichele Register Successfully");
        GetRides();
        setName("");
        setSeat("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const DeleteRides = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this record?")) {
        setLoading2(true);
        const result = await DeeleteVichele(id);
        if (result?.data?.data) {
          toast.success("Vichele Delete Successfully");
          GetRides();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const GetRides = async () => {
    try {
      setLoading2(true);
      const result = await FetchVicheleAPI();
      if (result?.data?.data) {
        setState(result?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    GetRides();
  }, []);

  return (
    <>
      <section className="vichele">
        <h1>
          <i className="bx bxs-car"></i>Vichele
        </h1>
        <div className="a">
          <div className="form">
            <div className="form-group">
              <label>Model Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter Car model name"
              />
            </div>
            <div className="form-group">
              <label>Seat</label>
              <input
                type="number"
                placeholder="Enter Seat number"
                onChange={(e) => setSeat(e.target.value)}
                value={seat}
              />
            </div>
            <div className="form-group">
              <label>Vichele Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value={""}>Select vichele type</option>

                {vicheles?.map((d) => (
                  <option value={d?.name}>{d?.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button disabled={loading} onClick={createVichele}>
            {loading ? <LoadingOutlined /> : "Submit"}
          </button>
        </div>
        <div className="b">
          <p>Display Vichele Records</p>
          <div className="wrap">
            {loading2 ? (
              <div className="loader">
                <LoadingOutlined />
              </div>
            ) : (
              state?.map((d) => (
                <div className="box" key={d?._id}>
                  <div className="leftv">
                    <h4>{d?.name}</h4>
                    <p>{d?.seat} Seater</p>
                    <p>Image Type: {d?.type} </p>
                  </div>
                  <div className="rightv">
                    <span onClick={() => DeleteRides(d?._id)}>
                      <i className="bx bx-trash"></i>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Vichele;
