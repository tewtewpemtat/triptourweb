// TablePage.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase'; // เรียกใช้ firestore
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // เรียกใช้งาน collection, getDocs, doc และ deleteDoc จาก Firebase Firestore
import './showtrip.css'; // Corrected CSS import path
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar'; 

function ShowTrip() {
  const [tripData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, 'trips');
        const usersSnapshot = await getDocs(usersRef);
        const userDataArray = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          data.uid = doc.id; // เพิ่ม Document ID ลงในข้อมูลผู้ใช้
          return data;
        });
        setUserData(userDataArray);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteUser = async (uid) => {
    try {
      await deleteDoc(doc(firestore, 'users', uid));
      const updatedUserData = tripData.filter(user => user.uid !== uid);
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  return (
    <div>
      <Navbar/>
      <h1>ข้อมูลทริป</h1>
      <table>
        <thead>
          <tr>  
          <th>UidTrip</th>
            <th>tripCreate</th>
            <th>tripName</th>
            <th>tripStartDate</th>
            <th>tripEndDate</th>
            <th>tripLimit</th>
            <th>tripJoin</th>
            <th>tripProfileUrl</th>
            <th>tripStatus</th>
            <th>Action</th> {/* เพิ่ม column สำหรับ row action */}
          </tr>
        </thead>
        <tbody>
          {tripData.map((user, index) => (
            <tr key={index}>
              <td>{user.uid}</td>
              <td>{user.tripCreate}</td> {/* แสดง Document ID */}
              <td>{user.tripName}</td>
              <td>{user.tripStartDate ? user.tripStartDate.toDate().toLocaleString() : ''}</td>
              <td>{user.tripEndDate ? user.tripEndDate.toDate().toLocaleString() : ''}</td>
              <td>{user.tripLimit}</td>
              <td>{user.tripJoin.length}</td>
    
              <td><img src={user.tripProfileUrl} alt="Profile" /></td>
              <td>{user.tripStatus}</td>
              <td>
              <Link to={`/edittrip/${user.uid}`}> {/* Use Link to navigate to edit user page */}
                  <img
                    src="/pencil.png"
                    alt="Edit"
                    className="action-icon"
                  />
                </Link>
                <img
                  src="/delete.png"
                  alt="Delete"
                  className="action-icon"
                  onClick={() => handleDeleteUser(user.uid)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowTrip;
