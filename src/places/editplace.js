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
  const [placestatus, setplaceStatus] = useState('');
  const [placerun, setrunStatus] = useState('');
  const [placeadd, setaddStatus] = useState('');
  const [placetimestart, setplacetimestart] = useState(new Date()); // State for trip start date
  const [placetimeend, setplacetimeend] = useState(new Date()); // State for trip end date

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, 'places', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          setplaceStatus(userSnapshot.data().placestatus || '');
          setrunStatus(userSnapshot.data().placerun || '');
          setaddStatus(userSnapshot.data().placeadd || '');
          // Set trip start and end dates if available
          if (userSnapshot.data().placetimestart) {
            setplacetimestart(new Date(userSnapshot.data().placetimestart.seconds * 1000));
          }
          if (userSnapshot.data().placetimeend) {
            setplacetimeend(new Date(userSnapshot.data().placetimeend.seconds * 1000));
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

  const handlePlaceChange3 = (e) => {
    const value = e.target.value;
    setplaceStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      placestatus: value,
    }));
  };
  const handlePlaceChange2 = (e) => {
    const value = e.target.value;
    setaddStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      placeadd: value,
    }));
  };
  const handlePlaceChange = (e) => {
    const value = e.target.value;
    setrunStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      placerun: value,
    }));
  };
  return (
    <div style={{ paddingTop: '60px' }}>
      <div className="edit-user-container">
        <h1>แก้ไขสถานที่</h1>
        <form>
          <div className="form-group">
            <label>placename:</label>
            <input
              type="text"
              name="placename"
              value={userData.placename || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>placeaddress:</label>
            <input
              type="text"
              name="placeaddress"
              value={userData.placeaddress || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>placeprovince:</label>
            <input
              type="text"
              name="placeprovince"
              value={userData.placeprovince || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>placetripid:</label>
            <input
              type="text"
              name="placetripid"
              value={userData.placetripid || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>placeLatitude:</label>
            <input
              type="text"
              name="placeLatitude"
              value={userData.placeLatitude || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>placeLongitude:</label>
            <input
              type="text"
              name="placeLongitude"
              value={userData.placeLongitude || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
         
          <div className="form-group">
            <label>placetimestart:</label>
            <DatePicker
              selected={placetimestart}
              onChange={(date) => {
                setplacetimestart(date);
                setUserData((prevData) => ({
                  ...prevData,
                  placetimestart: date,
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
            <label>placetimeend:</label>
            <DatePicker
              selected={placetimeend}
              onChange={(date) => {
                setplacetimeend(date);
                setUserData((prevData) => ({
                  ...prevData,
                  placetimeend: date,
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
            <label>useruid</label>
            <input
              type="text"
              name="useruid"
              value={userData.useruid || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
  <label>placewhogo:</label>
  <ul>
    {userData.placewhogo && userData.placewhogo.map((item, index) => (
      <li key={index}>
        <input
          type="text"
          value={item}
          onChange={(e) => {
            const updatedPlacewhogo = [...userData.placewhogo];
            updatedPlacewhogo[index] = e.target.value;
            setUserData((prevData) => ({
              ...prevData,
              placewhogo: updatedPlacewhogo,
            }));
          }}
        />
        <button
          type="button"
          onClick={() => {
            const updatedPlacewhogo = [...userData.placewhogo];
            updatedPlacewhogo.splice(index, 1);
            setUserData((prevData) => ({
              ...prevData,
              placewhogo: updatedPlacewhogo,
            }));
          }}
        >
          ลบ
        </button>
      </li>
    ))}
  </ul>
  <button
    type="button"
    onClick={() => {
      setUserData((prevData) => ({
        ...prevData,
        placewhogo: [...prevData.placewhogo, ''], // เพิ่มค่าใหม่เป็นสตริงเปล่า
      }));
    }}
  >
    เพิ่ม
  </button>
</div>

          <div className="form-group">
            <label>placeadd:</label>
            <select
              name="placeadd"
              value={placeadd}
              onChange={handlePlaceChange}
              className="input"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>placerun:</label>
            <select
              name="placerun"
              value={placerun}
              onChange={handlePlaceChange2}
              className="input"
            >
              <option value="Start">Start</option>
              <option value="Running">Running</option>
              <option value="End">End</option>
            </select>
          </div>
          <div className="form-group">
            <label>placestatus:</label>
            <select
              name="placestatus"
              value={placestatus}
              onChange={handlePlaceChange3}
              className="input"
            >
              <option value="Added">Added</option>
              <option value="Wait">Wait</option>
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
