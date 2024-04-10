import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import './editplace.css'; // Import CSS file for styling
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase'; // import Firebase storage instance

function EditPlace() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [tripStatus, settripStatus] = useState('');
  const [tripStartDate, setTripStartDate] = useState(new Date()); // State for trip start date
  const [tripEndDate, setTripEndDate] = useState(new Date()); // State for trip end date

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, 'places', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          settripStatus(userSnapshot.data().tripStatus || '');
          // Set trip start and end dates if available
          if (userSnapshot.data().tripStartDate) {
            setTripStartDate(new Date(userSnapshot.data().tripStartDate.seconds * 1000));
          }
          if (userSnapshot.data().tripEndDate) {
            setTripEndDate(new Date(userSnapshot.data().tripEndDate.seconds * 1000));
          }

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
   
   
      const userDoc = doc(firestore, 'places', userId);
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
    console.log('Selected image:', imageFile);
    setProfileImage(imageFile);
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    settripStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      tripStatus: value,
    }));
  };

  return (
    <div style={{ paddingTop: '60px' }}>
      <div className="edit-user-container">
        <h1>แก้ไขทริป</h1>
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
              value={userData.tripName || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>tripStartDate:</label>
            <DatePicker
              selected={tripStartDate}
              onChange={(date) => {
                setTripStartDate(date);
                setUserData((prevData) => ({
                  ...prevData,
                  tripStartDate: date,
                }));
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="yyyy/MM/dd HH:mm"
              className="input"
            />
          </div>
          <div className="form-group">
            <label>tripEndDate:</label>
            <DatePicker
              selected={tripEndDate}
              onChange={(date) => {
                setTripEndDate(date);
                setUserData((prevData) => ({
                  ...prevData,
                  tripEndDate: date,
                }));
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="yyyy/MM/dd HH:mm"
              className="input"
            />
          </div>
          <div className="form-group">
            <label>tripStatus:</label>
            <select
              name="tripStatus"
              value={tripStatus}
              onChange={handleGenderChange}
              className="input"
            >
              <option value="">เลือกสถานะ</option>
              <option value="ยังไม่เริ่มต้น">ยังไม่เริ่มต้น</option>
              <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              <option value="สิ้นสุด">สิ้นสุด</option>
            </select>
          </div>
  
          <button type="button" onClick={handleUpdateUser} className="button">
            อัปเดต
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPlace;
