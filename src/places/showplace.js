// TablePage.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase'; // เรียกใช้ firestore
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // เรียกใช้งาน collection, getDocs, doc และ deleteDoc จาก Firebase Firestore
import './editplace.css'; // Corrected CSS import path
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar'; 

function ShowPlace() {
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
        const usersRef = collection(firestore, 'places');
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
      await deleteDoc(doc(firestore, 'places', uid));
      const updatedUserData = tripData.filter(user => user.uid !== uid);
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  return (
    
    <div>
         <Navbar/>
      <h1>ข้อมูลสถานที่</h1>
      <table>
        <thead>
          <tr>  
          <th>ID</th>
            <th>placename</th>
            <th>placeaddress</th>
            <th>placeprovince</th>
            <th>placetripid</th>
            <th>placeLatitude</th>
            <th>placeLongitude</th>
            <th>placestart</th>
            <th>placetimestart</th>
            <th>placetimeend</th>
            <th>useruid</th>
            <th>placeadd</th>
            <th>placerun</th>
            <th>placestatus</th>
            <th>placewhogo</th>
            <th>placepicUrl</th>
            <th>Action</th> {/* เพิ่ม column สำหรับ row action */}
          </tr>
        </thead>
        <tbody>
          {tripData.map((user, index) => (
            <tr key={index}>
              <td>{user.uid}</td>
              <td>{user.placename}</td> {/* แสดง Document ID */}
              <td>{user.placeaddress}</td>
              <td>{user.placeprovince}</td>
              <td>{user.placetripid}</td>
              <td>{user.placeLatitude}</td>
              <td>{user.placeLongitude}</td>
              <td>Latitude: {user.placestart.latitude}, Longitude: {user.placestart.longitude}</td>
              <td>{user.placetimestart ? user.placetimestart.toDate().toLocaleString() : ''}</td>
              <td>{user.placetimeend ? user.placetimeend.toDate().toLocaleString() : ''}</td>
              <td>{user.useruid}</td>
              <td>{user.placeadd}</td>
              <td>{user.placerun}</td>
              <td>{user.placestatus}</td>
              <td>{user.placewhogo.length}</td>
              <td><img src={user.placepicUrl} alt="Profile" /></td>
              <td>
              <Link to={`/editplace/${user.uid}`}> {/* Use Link to navigate to edit user page */}
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

export default ShowPlace;
