// Login.js
import React, { useState , useEffect } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore,getDoc,doc } from '../firebase'; // นำเข้า Firebase authentication และ firestore instances ที่สร้างไว้ก่อนหน้านี้
import { useNavigate , Navigate} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ตรวจสอบว่า uid ของผู้ใช้ที่ล็อกอินเข้าสู่ระบบมีใน collection admins หรือไม่
      const adminSnapshot = await getDoc(doc(firestore, "admins", user.uid));
      if (adminSnapshot.exists()) {
        localStorage.setItem('authToken', user.uid);
        localStorage.setItem('email', user.email);
        navigate('/users');
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
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/users', { replace: true });
    }
  }, [navigate]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;