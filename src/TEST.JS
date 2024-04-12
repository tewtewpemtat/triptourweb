import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import './edittrip.css'; // Import CSS file for styling
import { ref, uploadBytes } from 'firebase/storage';
import Navbar from '../navbar';
import { storage } from '../firebase'; // import Firebase storage instance
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  MenuItem,
} from "@mui/material";

function EditTrip() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [tripStatus, settripStatus] = useState('');
  const [tripStartDate, setTripStartDate] = useState(new Date()); // State for trip start date
  const [tripEndDate, setTripEndDate] = useState(new Date()); // State for trip end date

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, 'trips', userId);
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
      if (profileImage) {
        // อัปโหลดรูปภาพไปยัง Firebase Storage
    
        // สร้าง URL ของรูปภาพที่อัปโหลด
        const profileImageUrl = await uploadProfileImageToStorage(profileImage, userId);
        // อัปเดต tripProfileUrl ในข้อมูลผู้ใช้
        setUserData((prevData) => ({
          ...prevData,
          tripProfileUrl: profileImageUrl,
        }));
      }
      const userDoc = doc(firestore, 'trips', userId);
      await updateDoc(userDoc, userData);
      console.log('User updated successfully!');
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };
  const uploadProfileImageToStorage = async (imageFile, userId) => {
    try {
      const storageRef = ref(storage, `trip/profiletrip/${userId}.jpg`);
      await uploadBytes(storageRef, imageFile);
      console.log('Image uploaded successfully!');
      // สร้าง URL ของรูปภาพที่อัปโหลด
      const profileImageUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/${encodeURIComponent('trip/profiletrip/' + userId + '.jpg')}?alt=media`;
      
      console.log('Profile image URL:', profileImageUrl);
      
      return profileImageUrl; // ส่งกลับ URL ของรูปภาพ
    } catch (error) {
      console.error('Error uploading image:', error);
      return null; // หากเกิดข้อผิดพลาดในการอัปโหลด ส่งค่า null กลับไป
    }
  };
  

  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    console.log('Selected image:', imageFile);
    setProfileImage(imageFile);
  };
  const handleSubmit = () => {
    handleUpdateUser();
    alert('แก้ไขข้อมูลสำเร็จ');
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
    <div>
    <Navbar/>
    <div style={{marginLeft: 200}}>
    <Grid container spacing={0}>
      <Grid item lg={12} md={12} xs={12}>
        <Card variant="outlined">
          <Box
            sx={{
              padding: "15px 30px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box flexGrow={1}>
              <Typography variant="h5" style={{fontSize:'18px' ,fontWeight: 'bold', fontFamily: 'Arial, sans-serif' ,color: '#4a5568'}}>เเก้ไขข้อมูล</Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ padding: "30px" }}>
            <form>
            <Grid container spacing={2}>
<Grid item lg={6}>
  {/* ตำแหน่ง TextField ที่ 1 */}
  <TextField
    id="tripCreate"
    label="tripCreate"
    variant="outlined"
    fullWidth
    sx={{ mb: 2 }}
    value={userData.tripCreate || ''}
    onChange={handleChange}
  />
</Grid>
<Grid item lg={6}>
  {/* ตำแหน่ง TextField ที่ 2 */}
  <TextField
    id="tripName"
    label="tripName"
    variant="outlined"
    fullWidth
    sx={{ mb: 2 }}
    value={userData.tripName || ''}
    onChange={handleChange}
  />
</Grid>
</Grid>

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
  <label>tripJoin:</label>
  <ul>
    {userData.tripJoin && userData.tripJoin.map((item, index) => (
      <li key={index}>
        <input
          type="text"
          value={item}
          onChange={(e) => {
            const updatedtripJoin = [...userData.tripJoin];
            updatedtripJoin[index] = e.target.value;
            setUserData((prevData) => ({
              ...prevData,
              tripJoin: updatedtripJoin,
            }));
          }}
        />
        <button
          type="button"
          onClick={() => {
            const updatedtripJoin = [...userData.tripJoin];
            updatedtripJoin.splice(index, 1);
            setUserData((prevData) => ({
              ...prevData,
              tripJoin: updatedtripJoin,
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
        tripJoin: [...prevData.tripJoin, ''], // เพิ่มค่าใหม่เป็นสตริงเปล่า
      }));
    }}
  >
    เพิ่ม
  </button>
</div>

              <FormControl fullWidth sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
<Grid item>
  <Typography sx={{ mr: 1 }}>tripStatus:</Typography>
</Grid>
<Grid item>
  <RadioGroup row name="tripStatus" value={tripStatus} onChange={handleGenderChange}>
    <FormControlLabel value="ยังไม่เริ่มต้น" control={<Radio />} label="ยังไม่เริ่มต้น" />
    <FormControlLabel value="กำลังดำเนินการ" control={<Radio />} label="กำลังดำเนินการ" />
    <FormControlLabel value="สิ้นสุด" control={<Radio />} label="สิ้นสุด" />
  </RadioGroup>
</Grid>
</Grid>

              </FormControl>
              <TextField
                id="tripProfileUrl"
                label="Trip Image URL"
                variant="outlined"
                type="file"
                fullWidth
                sx={{ mb: 2 }}
                onChange={handleImageChange}
                InputLabelProps={{ shrink: true }}
              />
              <Box textAlign="right">
                <Button color="primary" variant="contained" type="button" onClick={handleSubmit}>
                  Update
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </div>
  </div>
  );
}

export default EditTrip;
