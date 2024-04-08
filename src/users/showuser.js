// TablePage.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase'; // เรียกใช้ firestore
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // เรียกใช้งาน collection, getDocs, doc และ deleteDoc จาก Firebase Firestore
import './showuser.css'; // Corrected CSS import path
import { BrowserRouter as Router, Routes, Route, Link,Navigate } from 'react-router-dom';
function ShowUser() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, 'users');
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
      const updatedUserData = userData.filter(user => user.uid !== uid);
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <h1>ข้อมูลผู้ใช้</h1>
      <table>
        <thead>
          <tr>
            <th>UID</th>
            <th>Contact Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Nickname</th>
            <th>Gender</th>
            <th>Profile Image</th>
            <th>Action</th> {/* เพิ่ม column สำหรับ row action */}
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td>{user.uid}</td> {/* แสดง Document ID */}
              <td>{user.contactNumber}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.nickname}</td>
              <td>{user.gender}</td>
              <td><img src={user.profileImageUrl} alt="Profile" /></td>
              <td>
              <Link to={`/edituser/${user.uid}`}> {/* Use Link to navigate to edit user page */}
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

export default ShowUser;
