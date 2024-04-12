// Login.js
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, getDoc, doc } from "../firebase"; // นำเข้า Firebase authentication และ firestore instances ที่สร้างไว้ก่อนหน้านี้
import { useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./login.css"; // Corrected CSS import path

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ตรวจสอบว่า uid ของผู้ใช้ที่ล็อกอินเข้าสู่ระบบมีใน collection admins หรือไม่
      const adminSnapshot = await getDoc(doc(firestore, "admins", user.uid));
      if (adminSnapshot.exists()) {
        localStorage.setItem("authToken", user.uid);
        localStorage.setItem("email", user.email);
        navigate("/users");
        alert("เข้าสู่ระบบสำเร็จ");
      } else {
        console.log("User is not an admin");
        // ออกจากระบบ
        await auth.signOut();
        // แสดง alert ว่าอีเมลหรือรหัสผ่านไม่ถูกต้อง
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }

      console.log("User logged in:", user);
    } catch (error) {
      console.error("Error signing in:", error.message);
      // แสดง alert ว่าอีเมลหรือรหัสผ่านไม่ถูกต้อง
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
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