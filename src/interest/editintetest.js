import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./editinterest.css";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";
import Navbar from "../navbar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PhotoIcon from "@mui/icons-material/Photo";
import {
  Card,
  InputLabel,
  CardContent,
  Divider,
  Box,
  Select,
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
import { margins } from '../styles/margin'
function EditInterest() {
  const { placeTripId, userId } = useParams();
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "interest", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
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

      if (selectedFile) {
        if (userData.placepicUrl) {
          await deleteOldImage(userData.placepicUrl);
        }
        const profileLink = await uploadProfileImageToStorage(
          selectedFile,
          userId
        );
        updatedUserData.placepicUrl = profileLink;
        console.log(profileLink);
        console.log(updatedUserData.placepicUrl);
      }

      const userDoc = doc(firestore, "interest", userId);
      await updateDoc(userDoc, updatedUserData);
      alert("แก้ไขข้อมูลสำเร็จ");
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  function generateRandomNumber() {
    const min = 100000000;
    const max = 999999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  }

  const uploadProfileImageToStorage = async (imageFile, userId) => {
    try {
      const randomImg = generateRandomNumber();
      const filePath = `trip/places/interest/${placeTripId}/${randomImg}.jpg`;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
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
                <Link to={`/interest`}>
                  <ArrowBackIosIcon style={{ color: "#4a5568" }} />
                </Link>

                <Typography
                  variant="h5"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    color: "#4a5568",
                    marginLeft: "5px",
                  }}
                >
                  แก้ไขข้อมูล
                </Typography>
              </Box>

              <Divider />
              <CardContent sx={{ padding: "30px" }}>
                <form>
                  <Grid style={{ marginBottom: "20px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        label="placeAddress"
                        name="placeaddress"
                        value={userData.placeaddress || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label="userUid"
                        name="useruid"
                        value={userData.useruid || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                  </Grid>
                  <Grid style={{ marginBottom: "20px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        label="placeTripid"
                        name="placetripid"
                        value={userData.placetripid || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label="placeId"
                        name="placeid"
                        value={userData.placeid || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                  </Grid>
                  <Grid style={{ marginBottom: "25px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        label="placeLatitude"
                        name="placeLatitude"
                        value={userData.placeLatitude || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label="placeLongitude"
                        name="placeLongitude"
                        value={userData.placeLongitude || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                  </Grid>
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
                        เปลี่ยนรูปจุดนัดพบ
                      </Button>
                    </InputLabel>
                    <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                      {selectedFile ? selectedFile.name : "ไม่ได้เลือกไฟล์"}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      onClick={handleUpdateUser}
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

export default EditInterest;
