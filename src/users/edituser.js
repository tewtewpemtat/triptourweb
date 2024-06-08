import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ListItemIcon } from "@material-ui/core";
import { firestore } from "../firebase";
import "./edituser.css";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Navbar from "../navbar";
import { storage } from "../firebase";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PhotoIcon from "@mui/icons-material/Photo";
import { margins } from '../styles/margin'

import {
  Card,
  CardContent,
  InputLabel,
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
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState("");
  const [profileStatus, setProfileStatus] = useState("");
  const [friendList, setFriendList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          setGender(userSnapshot.data().gender || "");
          setProfileStatus(userSnapshot.data().profileStatus || "");
          setFriendList(userSnapshot.data().friendList || []);

        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const deleteOldImage = async (url) => {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
      console.log("Old image deleted successfully!");
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
  };
  const handleUpdateUser = async () => {
    try {
      let updatedUserData = { ...userData };

      if (profileImage) {
        if (userData.profileImageUrl) {
          await deleteOldImage(userData.profileImageUrl);
        }
        const profileLink = await uploadProfileImageToStorage(
          profileImage,
          userId
        );
        updatedUserData.profileImageUrl = profileLink;
      }
      const userDoc = doc(firestore, "users", userId);
      await updateDoc(userDoc, updatedUserData);
      alert("แก้ไขข้อมูลสำเร็จ");
      console.log("User updated successfully!");
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
      const filePath = `profilepic/${userId}/profile.jpg`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, imageFile);
      console.log("Image uploaded successfully!");

      const downloadURL = await getDownloadURL(storageRef);

      console.log("Profile image URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  const handlefriendList = (index, newValue) => {
    const updatedfriendList = [...friendList];
    updatedfriendList[index] = newValue;
    setFriendList(updatedfriendList);
    setUserData((prevData) => ({
      ...prevData,
      friendList: updatedfriendList,
    }));
  };

  const handleAddfriendList = () => {
    setFriendList((prevfriendList) => [...prevfriendList, ""]);
    setUserData((prevData) => ({
      ...prevData,
      friendList: [...prevData.friendList, ""],
    }));
  };

  const handleRemovefriendList = (index) => {
    const updatedfriendList = [...friendList];
    updatedfriendList.splice(index, 1);
    setFriendList(updatedfriendList);
    setUserData((prevData) => ({
      ...prevData,
      friendList: updatedfriendList,
    }));
  };
  const handleSubmit = () => {
    handleUpdateUser();
  };
  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGender(value);
    setUserData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setProfileStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      profileStatus: value,
    }));
  };
  return (
    <div>
      <Navbar />
      <div style={{ marginLeft: margins.editMargin }}>
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
                <Link to={`/users`}>
                  <ArrowBackIosIcon style={{ color: "#4a5568" }} />
                </Link>
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
              <Divider />
              <CardContent sx={{ padding: "30px" }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
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
                  <Grid style={{ marginBottom: "10px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <div>
                        <label>FriendList : </label>
                        <ul>
                          {friendList.map((item, index) => (
                            <div key={index}>
                              <Grid container spacing={2} key={index}>
                                <Grid item xs={10}>
                                  <TextField
                                    id={`friendList-${index}`}
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: "8px" }}
                                    value={item}
                                    onChange={(e) =>
                                      handlefriendList(
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <Button
                                    style={{
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                      backgroundColor: "red",
                                    }}
                                    variant="contained"
                                    onClick={() => handleRemovefriendList(index)}
                                  >
                                    ลบ
                                  </Button>
                                </Grid>
                              </Grid>
                            </div>
                          ))}
                        </ul>
                        <Button variant="contained" onClick={handleAddfriendList}>
                          เพิ่ม
                        </Button>
                      </div>
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
                            label="ชาย"
                          />
                          <FormControlLabel
                            value="หญิง"
                            control={<Radio />}
                            label="หญิง"
                          />
                          <FormControlLabel
                            value="เพศทางเลือก"
                            control={<Radio />}
                            label="เพศทางเลือก"
                          />
                        </RadioGroup>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography sx={{ mr: 1 }}>Profile Status : </Typography>
                      </Grid>
                      <Grid item>
                        <RadioGroup
                          row
                          name="profileStatus"
                          value={profileStatus}
                          onChange={handleStatusChange}
                        >
                          <FormControlLabel
                            value="None"
                            control={<Radio />}
                            label="None"
                          />
                          <FormControlLabel
                            value="Completed"
                            control={<Radio />}
                            label="Completed"
                          />
                        </RadioGroup>
                      </Grid>
                    </Grid>
                  </FormControl>
                  <TextField
                    id="upload-file"
                    type="file"
                    inputProps={{ accept: ".jpg, .jpeg, .png" }}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      marginBottom: "20px",
                    }}
                  >
                    <InputLabel
                      htmlFor="upload-file"
                      sx={{ cursor: "pointer" }}
                    >
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<PhotoIcon />}
                      >
                        เปลี่ยนรูปโปรไฟล์
                      </Button>
                    </InputLabel>
                    <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                      {profileImage ? profileImage.name : "ไม่ได้เลือกไฟล์"}
                    </Typography>
                  </Box>
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
