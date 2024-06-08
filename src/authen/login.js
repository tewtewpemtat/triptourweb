import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs-react";
import { firestore } from "../firebase";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const adminsRef = collection(firestore, "admins");
      const q = query(adminsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let loginSuccessful = false;
        querySnapshot.forEach(async (doc) => {
          const adminData = doc.data();
          const hashedPassword = adminData.password;

          if (hashedPassword) {
            const passwordMatch = await bcrypt.compare(
              password,
              hashedPassword
            );
            if (passwordMatch) {
              localStorage.setItem("authToken", email);
              localStorage.setItem("email", email);
              navigate("/users");
              alert("เข้าสู่ระบบสำเร็จ");
              loginSuccessful = true;
            } else {
              alert("รหัสผ่านไม่ถูกต้อง");
            }
          }
        });
      } else {
        alert("อีเมลไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("เกิดข้อผิดพลาดขณะเข้าสู่ระบบ");
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/users", { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ margin: "5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          marginTop: "15px",
          marginBottom: "15px",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="Logo"
          style={{ maxWidth: "120px" }}
        />
      </div>

      <form className="formLogin" onSubmit={handleLogin}>
        <div className="login">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <br />
        <button type="submit" className="loginbutton">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
