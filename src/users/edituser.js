import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import './edituser.css'; // Import CSS file for styling

function EditUser() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // State เพื่อเก็บรูปภาพที่เลือก
  const [gender, setGender] = useState(''); // State เพื่อเก็บเพศที่ผู้ใช้เลือก

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          setGender(userSnapshot.data().gender || ''); // กำหนดค่าเริ่มต้นของเพศ หรือเว้นว่างถ้าไม่มีค่า
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
    setGender(value);
    setUserData((prevData) => ({
      ...prevData,
      gender: value, // อัปเดตค่าฟิลด์เพศใน state userData
    }));
  };
  
  return (
    <div style={{ paddingTop: '60px' }}>
      <div className="edit-user-container">
        <h1>Edit User</h1>
        <form>
          <div className="form-group">
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={userData.contactNumber || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Nickname:</label>
            <input
              type="text"
              name="nickname"
              value={userData.nickname || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={gender}
              onChange={handleGenderChange} // เปลี่ยนเป็น handleGenderChange แทน handleChange
              className="input"
            >
              <option value="">Select Gender</option>
              <option value="ชาย">Male</option>
              <option value="หญิง">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Profile Image URL:</label>
            <input
              type="file"
              name="profileImageUrl"
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

export default EditUser;
