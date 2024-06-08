import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./edittrip.css";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import Navbar from "../navbar";
import { storage } from "../firebase";
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
function EditTrip() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [tripStatus, settripStatus] = useState("");
  const [tripStartDate, setTripStartDate] = useState(new Date());
  const [tripEndDate, setTripEndDate] = useState(new Date());
  const [tripJoin, setTripJoin] = useState([]);
  const [tripLimit, setTripLimit] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "trips", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          settripStatus(userSnapshot.data().tripStatus || "");
          setTripJoin(userSnapshot.data().tripJoin || []);
          setTripLimit(userSnapshot.data().tripLimit || 0);
          if (userSnapshot.data().tripStartDate) {
            setTripStartDate(
              new Date(userSnapshot.data().tripStartDate.seconds * 1000)
            );
          }
          if (userSnapshot.data().tripEndDate) {
            setTripEndDate(
              new Date(userSnapshot.data().tripEndDate.seconds * 1000)
            );
          }
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
        if (userData.tripProfileUrl) {
          await deleteOldImage(userData.tripProfileUrl);
        }
        const profileLink = await uploadProfileImageToStorage(
          profileImage,
          userId
        );
        updatedUserData.tripProfileUrl = profileLink;
      }
      const userDoc = doc(firestore, "trips", userId);
      await updateDoc(userDoc, updatedUserData);
      alert("แก้ไขข้อมูลสำเร็จ");
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const uploadProfileImageToStorage = async (imageFile, userId) => {
    try {
      const filePath = `trip/profiletrip/${userId}.jpg`;
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

  const handleTripJoinChange = (index, newValue) => {
    const updatedTripJoin = [...tripJoin];
    updatedTripJoin[index] = newValue;
    setTripJoin(updatedTripJoin);
    setUserData((prevData) => ({
      ...prevData,
      tripJoin: updatedTripJoin,
    }));
  };

  const handleAddTripJoin = () => {
    setTripJoin((prevTripJoin) => [...prevTripJoin, ""]);
    setUserData((prevData) => ({
      ...prevData,
      tripJoin: [...prevData.tripJoin, ""],
    }));
  };

  const handleRemoveTripJoin = (index) => {
    const updatedTripJoin = [...tripJoin];
    updatedTripJoin.splice(index, 1);
    setTripJoin(updatedTripJoin);
    setUserData((prevData) => ({
      ...prevData,
      tripJoin: updatedTripJoin,
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleChangetriplimit = (e) => {
    const { value } = e.target;
    setTripLimit(value);
    setUserData((prevData) => ({
      ...prevData,
      tripLimit: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    console.log("Selected image:", imageFile);
    setProfileImage(imageFile);
  };
  const handleSubmit = () => {
    handleUpdateUser();
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
      <Navbar />
      <div style={{ marginLeft: margins.editMargin}}>
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
                <Link to={`/trips`}>
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
                <Link to={`/place/${userId}`} style={{ marginLeft: "auto" }}>
                  <Button color="primary" variant="contained" type="button">
                    ข้อมูลสถานที่
                  </Button>
                </Link>
              </Box>
              <Divider />
              <CardContent sx={{ padding: "30px" }}>
                <form>
                  <Grid style={{ marginBottom: "5px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        id="tripCreate"
                        label="tripCreate"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.tripCreate || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        id="tripName"
                        label="tripName"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.tripName || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item lg={4}>
                      <label htmlFor="tripStart">tripStart : </label>
                      <DatePicker
                        id="tripStart"
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
                        timeCaption="Time"
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="input"
                        customInput={
                          <TextField
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        }
                      />
                    </Grid>

                    <Grid item lg={4}>
                      <label htmlFor="tripEnd">tripEnd : </label>
                      <DatePicker
                        id="tripEnd"
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
                        timeCaption="Time"
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="input"
                        customInput={
                          <TextField
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        }
                      />
                    </Grid>

                    <Grid item lg={4}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel
                          id="tripLimit-label"
                          sx={{ backgroundColor: "#fff", px: 1 }}
                        >
                          tripLimit
                        </InputLabel>
                        <Select
                          id="tripLimit"
                          value={tripLimit}
                          onChange={handleChangetriplimit}
                          labelId="tripLimit-label"
                          displayEmpty
                        >
                          {[...Array(15)].map((_, index) => (
                            <MenuItem key={index} value={index + 1}>
                              {index + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid style={{ marginBottom: "10px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <div>
                        <label>tripJoin : </label>
                        <ul>
                          {tripJoin.map((item, index) => (
                            <div key={index}>
                              <Grid container spacing={2} key={index}>
                                <Grid item xs={10}>
                                  <TextField
                                    id={`tripJoin-${index}`}
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: "8px" }}
                                    value={item}
                                    onChange={(e) =>
                                      handleTripJoinChange(
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
                                    onClick={() => handleRemoveTripJoin(index)}
                                  >
                                    ลบ
                                  </Button>
                                </Grid>
                              </Grid>
                            </div>
                          ))}
                        </ul>
                        <Button variant="contained" onClick={handleAddTripJoin}>
                          เพิ่ม
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <label>tripStatus : </label>
                      </Grid>
                      <Grid item>
                        <RadioGroup
                          row
                          name="tripStatus"
                          value={tripStatus}
                          onChange={handleGenderChange}
                        >
                          <FormControlLabel
                            value="ยังไม่เริ่มต้น"
                            control={<Radio />}
                            label="ยังไม่เริ่มต้น"
                          />
                          <FormControlLabel
                            value="กำลังดำเนินการ"
                            control={<Radio />}
                            label="กำลังดำเนินการ"
                          />
                          <FormControlLabel
                            value="สิ้นสุด"
                            control={<Radio />}
                            label="สิ้นสุด"
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
                        เปลี่ยนรูปทริป
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

export default EditTrip;
