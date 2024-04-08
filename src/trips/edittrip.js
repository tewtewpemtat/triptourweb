import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import './edittrip.css'; // Import CSS file for styling

function EditTrip() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // State เพื่อเก็บรูปภาพที่เลือก
  const [tripStatus, settripStatus] = useState(''); // State เพื่อเก็บเพศที่ผู้ใช้เลือก

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, 'trips', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          settripStatus(userSnapshot.data().tripStatus || ''); // กำหนดค่าเริ่มต้นของเพศ หรือเว้นว่างถ้าไม่มีค่า
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateUser = async () => {
    try {
      const userDoc = doc(firestore, 'users', userId);
      await updateDoc(userDoc, userData);
      console.log('User updated successfully!');
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setProfileImage(imageFile);
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    settripStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      tripStatus: value, // อัปเดตค่าฟิลด์เพศใน state userData
    }));
  };
  
  return (
    <div style={{ paddingTop: '60px' }}>
      <div className="edit-user-container">
        <h1>เเก้ไขทริป</h1>
        <form>
          <div className="form-group">
            <label>tripCreate:</label>
            <input
              type="text"
              name="tripCreate"
              value={userData.tripCreate || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>tripName:</label>
            <input
              type="text"
              name="tripName"
              value={userData.tripName|| ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>tripStartDate:</label>
            <input
              type="text"
              name="tripStartDate"
              value={userData.tripStartDate || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>tripEndDate:</label>
            <input
              type="text"
              name="tripEndDate"
              value={userData.tripEndDate || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>tripStatus:</label>
            <select
              name="tripStatus"
              value={tripStatus}
              onChange={handleGenderChange} // เปลี่ยนเป็น handleGenderChange แทน handleChange
              className="input"
            >
              <option value="">เลือกสถานะ</option>
              <option value="ยังไม่เริ่มต้น">ยังไม่เริ่มต้น</option>
              <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              <option value="สิ้นสุด">สิ้นสุด</option>
            </select>
          </div>
          <div className="form-group">
            <label>tripProfileUrl:</label>
            <input
              type="file"
              name="tripProfileUrl"
              accept="image/*"
              onChange={handleImageChange}
              className="input"
            />
          </div>
          <button type="button" onClick={handleUpdateUser} className="button">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTrip;
