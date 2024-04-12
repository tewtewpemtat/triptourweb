// Login.js
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, getDoc, doc } from "../firebase"; // นำเข้า Firebase authentication และ firestore instances ที่สร้างไว้ก่อนหน้านี้
import { useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./login.css"; // Corrected CSS import path
import { collection, query, where, getDocs } from "firebase/firestore";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    e.preventDefault();
    try {
      // Query the admins collection to check if the email exists
      const adminsRef = collection(firestore, "admins");
      const q = query(adminsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User with the provided email exists, now check the password
        querySnapshot.forEach((doc) => {
          const adminData = doc.data();
          if (adminData.password === password) {
            // Authentication successful
            localStorage.setItem("authToken", email); // Using email as auth token
            localStorage.setItem("email", email);
            navigate("/users");
            alert("เข้าสู่ระบบสำเร็จ");
          } else {
            // Incorrect password
            alert("รหัสผ่านไม่ถูกต้อง");
          }
        });
      } else {
        // User not found in admins collection
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
