import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "./edituser.css"; // Import CSS file for styling
import { ref, uploadBytes } from "firebase/storage";
import Navbar from "../navbar";
import { storage } from "../firebase"; // import Firebase storage instance
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

function EditUser() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // State เพื่อเก็บรูปภาพที่เลือก
  const [gender, setGender] = useState(""); // State เพื่อเก็บเพศที่ผู้ใช้เลือก
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          setGender(userSnapshot.data().gender || ""); // กำหนดค่าเริ่มต้นของเพศ หรือเว้นว่างถ้าไม่มีค่า
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateUser = async () => {
    try {
      if (profileImage) {
        // อัปโหลดรูปภาพไปยัง Firebase Storage

        // สร้าง URL ของรูปภาพที่อัปโหลด
        const profileImageLink = await uploadProfileImageToStorage(
          profileImage,
          userId
        );
        // อัปเดต tripProfileUrl ในข้อมูลผู้ใช้
        setUserData((prevData) => ({
          ...prevData,
          profileImageUrl: profileImageLink,
        }));
      }
      const userDoc = doc(firestore, "users", userId);
      await updateDoc(userDoc, userData);
      console.log("User updated successfully!");
      alert("แก้ไขข้อมูลสำเร็จ");
      navigate('/users');
    } catch (error) {
      console.error("Error updating user: ", error);
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
    setProfileImage(imageFile);
  };
  const uploadProfileImageToStorage = async (imageFile, userId) => {
    try {
      const storageRef = ref(storage, `profilepic/${userId}/profile.jpg`);
      await uploadBytes(storageRef, imageFile);
      console.log("Image uploaded successfully!");
      // สร้าง URL ของรูปภาพที่อัปโหลด
      const profileImageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        storage.app.options.storageBucket
      }/o/${encodeURIComponent(
        "trip/profiletrip/" + userId + ".jpg"
      )}?alt=media`;

      console.log("Profile image URL:", profileImageUrl);

      return profileImageUrl; // ส่งกลับ URL ของรูปภาพ
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // หากเกิดข้อผิดพลาดในการอัปโหลด ส่งค่า null กลับไป
    }
  };
  const handleSubmit = () => {
    handleUpdateUser();
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
    <div>
      <Navbar />
      <div style={{ marginLeft: 200 }}>
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
                  <Typography
                    variant="h5"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                      color: "#4a5568",
                    }}
                  >
                    เเก้ไขข้อมูล
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <CardContent sx={{ padding: "30px" }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      {/* ตำแหน่ง TextField ที่ 1 */}
                      <TextField
                        id="firstName"
                        label="Firstname"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.firstName || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      {/* ตำแหน่ง TextField ที่ 2 */}
                      <TextField
                        id="lastName"
                        label="Lastname"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.lastName || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      {/* TextField สำหรับ Contact Number */}
                      <TextField
                        id="contactNumber"
                        label="Contact Number"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.contactNumber || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      {/* TextField สำหรับ Nickname */}
                      <TextField
                        id="nickname"
                        label="Nickname"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.nickname || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography sx={{ mr: 1 }}>Gender : </Typography>
                      </Grid>
                      <Grid item>
                        <RadioGroup
                          row
                          name="gender"
                          value={gender}
                          onChange={handleGenderChange}
                        >
                          <FormControlLabel
                            value="ชาย"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="หญิง"
                            control={<Radio />}
                            label="Female"
                          />
                          <FormControlLabel
                            value="เพศทางเลือก"
                            control={<Radio />}
                            label="Other"
                          />
                        </RadioGroup>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <TextField
                    id="profile-image"
                    label="profile Image URL"
                    variant="outlined"
                    type="file"
                    fullWidth
                    sx={{ mb: 2 }}
                    onChange={handleImageChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Box textAlign="right">
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      onClick={handleSubmit}
                    >
                      บันทึก
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

export default EditUser;
