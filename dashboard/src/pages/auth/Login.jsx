import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoginAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";
import {LoadingOutlined} from "@ant-design/icons"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (email === "") return toast.error("Email is required");
      if (password === "") return toast.error("Password is required");
      setLoading(true);
      const result = await LoginAPI(email, password);
      if (result?.data?.data) {
        toast.success("Login Success");
        localStorage.setItem("token", result?.data?.data[0]?.token);
        Navigate("/");
      } else {
        toast.error("Login Failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


useEffect(()=>{
const token = localStorage.getItem("token")
if(token==="zxcvbnmcuban345cubanjhjfshdfjhdsf77243zssssssxzdfdf24r234q213423x2qwAWEXRXTGEXRGTERTE"){
  return Navigate("/")
}
},[])





  return (
    <section className="login">
      <div className="wrap">
        <div className="form-group">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter Your Email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Your Password"
          />
        </div>
        <button disabled={loading} onClick={handleLogin}>
          {loading ? <LoadingOutlined /> : " Login"}
        </button>
      </div>
    </section>
  );
};

export default Login;
